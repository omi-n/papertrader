import { describe, expect, test } from "@jest/globals";
import {
    log_in,
    log_out,
    get_access_token,
    get_refresh_token,
    get_token,
    verify_token,
    refresh_token,
} from "./auth_utils.js";

// the test user: "testuser", "testpassword", "testemail@gmail.com"

describe("token api functions", () => {
    test("log in", test_log_in);
    test("log out", test_log_out);
    test("get token", test_get_token);
    test("refresh token", test_refresh_token);
});

async function test_log_in() {
    const response = await log_in("testuser", "testpassword");
    expect(response).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
    });
}

async function test_log_out() {
    log_out();
    expect(get_access_token()).toBe(null);
    expect(get_refresh_token()).toBe(null);
}

async function test_get_token() {
    const response = await get_token();
    expect(response).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
    });
}

async function test_refresh_token() {
    const response = await refresh_token();
    expect(response).toEqual({
        access_token: expect.any(String),
        refresh_token: expect.any(String),
    });
}
