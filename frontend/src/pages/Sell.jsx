import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get_ticker_data, get_ticker_data_timeframe, get_ticker_financials } from "../../../glue/yfinance_utils.js";
import { get_stocks, sell_stock } from "../../../glue/user_utils.js";

function Sell(){
    const { tickerSymbol } = useParams(); // Get the ticker symbol from the URL params
    const [tickerData, setTickerData] = useState(null);
    const [openingPrice, setOpeningPrice] = useState(0);
    const [shares, setShares] = useState(0);
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch additional data for the ticker symbol
                const data = await get_ticker_data(tickerSymbol);
                setTickerData(data);
                setOpeningPrice(data.history.Open[0]);
                const s = await get_stocks();
                setStocks(s);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, []);

    async function handleSale(e){
        e.preventDefault();
        console.log("Sale");
        try {
            const data = await sell_stock(tickerSymbol, shares, openingPrice);
            console.log("Sale:", data);
            navigate("/Profile");
        } catch (error) {
            console.error("Error during sale:", error.message);
            setError("Purchase failed. Please try again.");
        }
    };

    function findAmountByTicker(transactions, name) {
        const transaction = transactions.find(tx => tx.ticker === name);
        return transaction ? transaction.count : 0;
    }

    const uniqueStocks = stocks.reduce((acc, stock) => {
        const { ticker } = stock;
        if (!acc[ticker]) {
          acc[ticker] = { ...stock, count: 0 };
        }
        acc[ticker].count += 1;
        return acc;
      }, {});
      
    const uniqueStocksArray = Object.values(uniqueStocks);
    console.log("Unique", uniqueStocksArray);
    const amount = findAmountByTicker(uniqueStocksArray, tickerSymbol);
    console.log("amount", amount); 

    return (
        <div>
            {amount === 0 ? (
                <div>You have not purchased any of these shares.</div>
            ) : (
                <form onSubmit={handleSale}>
                    <p>You own {amount} shares of {tickerSymbol}</p>
                    <p>Current Opening Price = ${openingPrice} per share</p>
                    <input
                        type="number" min="0" max={amount}
                        placeholder="0"
                        value={shares}
                        onChange={(event) => setShares(event.target.value)}
                        required
                    />
                    <button type="submit">Sell Shares at ${openingPrice} each</button>
                </form>
                )}
        </div>
    );
}
export default Sell;