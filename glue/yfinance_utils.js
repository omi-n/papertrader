import { GLOBAL_BASE_URL } from "./base.js";

async function get_tickers(page) {
    const response = await fetch(
        `${GLOBAL_BASE_URL}/api/tickers/?page=${page}`
    );
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function get_ticker_data(ticker) {
    const response = await fetch(
        `${GLOBAL_BASE_URL}/api/yfinance/history/${ticker}`
    );
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function get_ticker_data_timeframe(ticker, timeframe) {
    /* Timeframe should be 
      '1d',  '5d',  '1mo',
      '3mo', '6mo', '1y',
      '2y',  '5y',  '10y',
      'ytd', 'max' 
    */
    const response = await fetch(
        `${GLOBAL_BASE_URL}/api/yfinance/history/${ticker}&${timeframe}`
    );
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function get_ticker_financials(ticker) {
    const response = await fetch(
        `${GLOBAL_BASE_URL}/api/yfinance/financials/${ticker}`
    );
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

export {
    get_tickers,
    get_ticker_data,
    get_ticker_data_timeframe,
    get_ticker_financials,
};
