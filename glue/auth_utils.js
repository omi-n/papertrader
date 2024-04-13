import {
    checkCookie,
    clearCookie,
    getCookie,
    setCookie,
} from "./cookie_utils.js";

const GLOBAL_BASE_URL = "http://localhost:8000";

/* -------------------------------------------------------------------------- */
// TOKEN UTILS
/* -------------------------------------------------------------------------- */
async function get_token(username, password, base_url = GLOBAL_BASE_URL) {
    // get the token for the user
    const response = await fetch(`${base_url}/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
    });
    const data = await response.json();
    return data;
}

async function _verify_token(access_token, base_url = GLOBAL_BASE_URL) {
    // verify the token
    const response = await fetch(`${base_url}/auth/token/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: access_token }),
    });
    const data = await response.json();
    return data;
}

async function verify_token(base_url = GLOBAL_BASE_URL) {
    const access_token = get_access_token();
    // verify the token
    const response = await _verify_token(access_token, base_url);
    return response;
}

async function _refresh_token(refresh_token, base_url = GLOBAL_BASE_URL) {
    // refresh the token
    const response = await fetch(`${base_url}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refresh_token }),
    });
    const data = await response.json();
    return data;
}

async function refresh_token(base_url = GLOBAL_BASE_URL) {
    const refresh_token = get_refresh_token();
    // refresh the token
    const response = await _refresh_token(refresh_token, base_url);
    if (response.access) {
        setCookie("access_token", response.access, 1);
    } else {
        return { error: response };
    }
    return response;
}

// TODO: have to make the cookie manager for these
function get_refresh_token() {
    const token = getCookie("refresh_token");
    if (token === false) {
        return null;
    }
    return token;
}

function get_access_token() {
    const token = getCookie("access_token");
    if (token === false) {
        return null;
    }
    return token;
}

function clear_tokens() {
    // clear the tokens
    clearCookie("access_token");
    clearCookie("refresh_token");
}

/* -------------------------------------------------------------------------- */
// AUTH UTILS
/* -------------------------------------------------------------------------- */
async function log_in(username, password, base_url = GLOBAL_BASE_URL) {
    // log in the user
    const data = await get_token(username, password, base_url);
    if (data.access) {
        setCookie("access_token", data.access, 1);
        setCookie("refresh_token", data.refresh, 1);
    } else {
        return { error: data };
    }
    return data;
}

function log_out() {
    // log out the user
    clear_tokens();
}

async function api_sign_up(
    username,
    password,
    email,
    base_url = GLOBAL_BASE_URL
) {
    const response = await fetch(`${base_url}/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email,
        }),
    });
    const data = await response.json();
    return data;
}

async function sign_up(username, password, email, base_url = GLOBAL_BASE_URL) {
    // sign up the user
    const response = await api_sign_up(username, password, email, base_url);

    // check if the user was created and return an error if not
    if (response.status === 200) {
        return await log_in(username, password, base_url);
    } else {
        return { error: response };
    }
}

async function is_logged_in() {
    // check if the user is logged in
    const token = get_access_token();
    if (token === null) {
        return false;
    }
    const data = await verify_token();
    return data.code === 200;
}

export {
    log_in,
    log_out,
    sign_up,
    is_logged_in,
    get_access_token,
    get_refresh_token,
    clear_tokens,
    get_token,
    verify_token,
    refresh_token,
    api_sign_up,
};
