const cryptoList = document.getElementById("crypto-list");
const extraCryptoList = document.getElementById("extra-crypto-list");
const cryptoInput = document.getElementById("crypto-input");
const fetchButton = document.getElementById("fetch-button");

const cryptos = ["BTC", "ETH", "XRP", "ZEC", "MATIC", "ADA"];
const urls = [
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,zcash,polygon,cardano&vs_currencies=usd",
    "https://api.coincap.io/v2/assets"
];

// Fetch prices on page load
fetchPrices();

// Fetch prices for predefined coins
async function fetchPrices() {
    try {
        const response = await fetch(urls[0]);
        if (!response.ok) throw new Error("API 1 failed");
        const data = await response.json();
        displayPricesFromApi1(data);
    } catch {
        try {
            const response = await fetch(urls[1]);
            if (!response.ok) throw new Error("API 2 failed");
            const data = await response.json();
            displayPricesFromApi2(data);
        } catch (error) {
            displayError(cryptoList, "Both APIs failed. Please try again later.");
        }
    }
}

// Fetch price for user-input coin
fetchButton.addEventListener("click", async () => {
    const symbol = cryptoInput.value.trim().toUpperCase();
    if (!symbol) return;
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`);
        if (!response.ok) throw new Error("API 1 failed");
        const data = await response.json();
        if (data[symbol.toLowerCase()]) {
            const price = data[symbol.toLowerCase()].usd;
            displayExtraPrice(symbol, price);
        } else {
            displayError(extraCryptoList, `Price for ${symbol} not found.`);
        }
    } catch {
        displayError(extraCryptoList, `Failed to fetch ${symbol}. Please try again.`);
    }
});

// Display prices for API 1 (CoinGecko)
function displayPricesFromApi1(data) {
    const prices = {
        BTC: data.bitcoin.usd,
        ETH: data.ethereum.usd,
        XRP: data.ripple.usd,
        ZEC: data.zcash.usd,
        MATIC: data.polygon.usd,
        ADA: data.cardano.usd
    };
    displayPrices(cryptoList, prices);
}

// Display prices for API 2 (CoinCap)
function displayPricesFromApi2(data) {
    const prices = {};
    const filtered = data.data.filter(coin =>
        cryptos.includes(coin.symbol.toUpperCase())
    );
    filtered.forEach(coin => {
        prices[coin.symbol.toUpperCase()] = parseFloat(coin.priceUsd).toFixed(2);
    });
    displayPrices(cryptoList, prices);
}

// Display a list of prices
function displayPrices(listElement, prices) {
    listElement.innerHTML = "";
    for (const [crypto, price] of Object.entries(prices)) {
        const li = document.createElement("li");
        li.textContent = `${crypto}: $${price}`;
        listElement.appendChild(li);
    }
}

// Display a single coin's price
function displayExtraPrice(symbol, price) {
    const li = document.createElement("li");
    li.textContent = `${symbol}: $${price}`;
    extraCryptoList.appendChild(li);
}

// Display error message
function displayError(listElement, message) {
    const li = document.createElement("li");
    li.className = "error";
    li.textContent = message;
    listElement.appendChild(li);
}
