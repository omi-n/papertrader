import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { log_in, verify_token, get_access_token, get_refresh_token, is_logged_in } from "../../../glue/auth_utils";
import { setCookie, getCookie } from "../../../glue/cookie_utils";
import { get_stocks } from "../../../glue/user_utils";

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

    const uniqueStocks = stocks.reduce((acc, stock) => {
        const { ticker } = stock;
        if (!acc[ticker]) {
          acc[ticker] = { ...stock, count: 0 };
        }
        acc[ticker].count += 1;
        return acc;
      }, {});
      
    const uniqueStocksArray = Object.values(uniqueStocks);
    
    return(
        <>
        <h1>Portfolio</h1>
        {stocks.length === 0 ? (
                // Render this block when there are no transactions
                <div>No Stocks available</div>
            ) : (
                // Render this block when there are transactions
                uniqueStocksArray.map((stock, index) => (
                <div key={index}>
                    <p>{stock.ticker}: {stock.count} shares owned</p>
                </div>
                ))
            )}
        </>
    );
};

export default Portfolio;