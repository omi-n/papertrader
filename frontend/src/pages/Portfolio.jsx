import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { log_in, verify_token, get_access_token, get_refresh_token, is_logged_in } from "../../../glue/auth_utils";
import { setCookie, getCookie } from "../../../glue/cookie_utils";
import { get_stocks } from "../../../glue/user_utils";
import { get_ticker_data } from "../../../glue/yfinance_utils"; // Import function to fetch ticker data

function Portfolio() {
    const [error, setError] = useState(null);
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loggedIn = await is_logged_in();
                if (!loggedIn) {
                    navigate("/login");
                } else {
                    const tokenValid = await verify_token();
                    if (!tokenValid) {
                        const refreshed = await refresh_token();
                        if (refreshed.error) {
                            setError("Session expired, please log in again.");
                            log_out();
                            navigate("/login");
                            return;
                        }
                    }
                    const result = await get_stocks();
                    if (result.error) {
                        setError("Error fetching stocks");
                    } else {
                        setStocks(result);
                    }
                }
            } catch (error) {
                setError("Error fetching balance");
            }
        };
        fetchData();
    }, [navigate]);

    useEffect(() => {
        const fetchOpeningPrices = async () => {
            const updatedStocks = [];
            for (const stock of stocks) {
                try {
                    const tickerData = await get_ticker_data(stock.ticker);
                    if (tickerData && tickerData.history && tickerData.history.Open && tickerData.history.Open.length > 0) {
                        const openingPrice = tickerData.history.Open[0];
                        stock.openingPrice = openingPrice;
                        updatedStocks.push(stock);
                    } else {
                        console.error(`No data found for opening price of ${stock.ticker}`);
                    }
                } catch (error) {
                    console.error(`Error fetching opening price for ${stock.ticker}:`, error);
                }
            }
            setStocks(updatedStocks);
        };

        if (stocks.length > 0) {
            fetchOpeningPrices();
        }
    }, [stocks]);

    const uniqueStocks = stocks.reduce((acc, stock) => {
        const { ticker } = stock;
        if (!acc[ticker]) {
            acc[ticker] = { ...stock, count: 0 };
        }
        acc[ticker].count += 1;
        return acc;
    }, {});
    
    const uniqueStocksArray = Object.values(uniqueStocks);

    return (
        <>
            <h1 className="h">Portfolio</h1>
            {stocks.length === 0 ? (
                // Render this block when there are no transactions
                <div>No Stocks available</div>
            ) : (
                // Render this block when there are transactions
                uniqueStocksArray.map((stock, index) => (
                    <div key={index}>
                        <p>{stock.ticker}: {stock.count} shares owned </p>
                        <p>Total Value: {(stock.openingPrice * stock.count).toFixed(2)}</p> {/* Calculate total value */}
                    </div>
                ))
            )}
        </>
    );
};

export default Portfolio;