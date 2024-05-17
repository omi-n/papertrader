import { get_access_token } from "./auth_utils.js";

const GLOBAL_BASE_URL = "http://localhost:8000";

async function get_balance() {
    const access_token = get_access_token();
    const response = await fetch(`${GLOBAL_BASE_URL}/api/user/balance/`, {
        method: "GET",
        headers: {
            Authorization: `${access_token}`,
        },
    });
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function set_balance(amount) {
    const access_token = get_access_token();
    const response = await fetch(`${GLOBAL_BASE_URL}/api/user/balance/`, {
        method: "POST",
        headers: {
            Authorization: `${access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amount }),
    });
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function get_transactions() {
    const access_token = get_access_token();
    const response = await fetch(`${GLOBAL_BASE_URL}/api/user/transaction/`, {
        method: "GET",
        headers: {
            Authorization: `${access_token}`,
        },
    });
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function get_stocks() {
    const access_token = get_access_token();
    const response = await fetch(`${GLOBAL_BASE_URL}/api/user/stock/`, {
        method: "GET",
        headers: {
            Authorization: `${access_token}`,
        },
    });
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function buy_stock(ticker, quantity, price) {
    const access_token = get_access_token();
    const response = await fetch(`${GLOBAL_BASE_URL}/api/user/stock/`, {
        method: "POST",
        headers: {
            Authorization: `${access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticker: ticker,
            amount: quantity,
            price: price,
        }),
    });
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

async function sell_stock(ticker, quantity, price) {
    const access_token = get_access_token();
    const response = await fetch(`${GLOBAL_BASE_URL}/api/user/stock/`, {
        method: "POST",
        headers: {
            Authorization: `${access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticker: ticker,
            amount: -quantity,
            price: price,
        }),
    });
    if (!response.ok) {
        return { error: response };
    }
    const data = await response.json();
    return data;
}

export { get_balance, set_balance, buy_stock, sell_stock, get_stocks, get_transactions };
