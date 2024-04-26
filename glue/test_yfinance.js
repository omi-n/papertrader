import {
    get_ticker_data,
    get_ticker_data_timeframe,
    get_ticker_financials,
    get_tickers,
} from "./yfinance_utils.js";

async function test_get_tickers() {
    const tickers = await get_tickers();
    console.log(tickers);
}

async function test_get_ticker_data() {
    const ticker = "AAPL";
    const data = await get_ticker_data(ticker);
    console.log(data);
}

async function test_get_ticker_data_timeframe() {
    const ticker = "AAPL";
    const timeframe = "1d";
    const data = await get_ticker_data_timeframe(ticker, timeframe);
    console.log(data);
}

async function test_get_ticker_financials() {
    const ticker = "AAPL";
    const data = await get_ticker_financials(ticker);
    console.log(data);
}

test_get_tickers();
test_get_ticker_data();
test_get_ticker_data_timeframe();
test_get_ticker_financials();
