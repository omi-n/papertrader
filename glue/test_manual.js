import {
    api_sign_up,
    _verify_token,
    _refresh_token,
    GLOBAL_BASE_URL,
    get_token,
} from "./auth_utils.js";

async function test_api_sign_up() {
    const randomname = Math.random().toString(36).substring(7);
    const response = await api_sign_up(
        randomname,
        "testpassword",
        "testemail@gmail.com"
    );
    console.log("signup: ", response);
}

async function test_get_token() {
    const response = await get_token("testuser", "testpassword");
    console.log("get_token: ", response);
}

async function test_verify_token() {
    const tokens = await get_token("testuser", "testpassword");
    const response = await _verify_token(tokens.access, GLOBAL_BASE_URL);
    console.log("verify: ", response);
}

async function test_refresh_token() {
    const tokens = await get_token("testuser", "testpassword");
    const response = await _refresh_token(tokens.refresh, GLOBAL_BASE_URL);
    console.log("refresh: ", response);
}

// test_api_sign_up();
test_verify_token();
test_refresh_token();
test_get_token();
