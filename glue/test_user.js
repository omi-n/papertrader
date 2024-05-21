const GLOBAL_BASE_URL = "http://localhost:8000";

const access =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE4MzMyMTU2LCJpYXQiOjE3MTU5MTI5NTYsImp0aSI6IjA0YWYxYmQxMjFhZDQ1ODQ4Y2M1NzBlNWIwYWQyNmIwIiwidXNlcl9pZCI6M30.G4flQhrgbXDowB_zqcVb04k5tlCoppdVtnMGXn3zi-o";
async function buy(access_token, ticker, quantity, price) {
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

buy(access, "AAPL", 1, 100);
