import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get_ticker_data, get_ticker_data_timeframe, get_ticker_financials } from "../../../glue/yfinance_utils.js";
import { get_balance, set_balance } from "../../../glue/user_utils";
import { buy_stock } from "../../../glue/user_utils"

function Buy(){
    const { tickerSymbol } = useParams(); // Get the ticker symbol from the URL params
    const [tickerData, setTickerData] = useState(null);
    const [openingPrice, setOpeningPrice] = useState(0);
    const [balance, setBalanceState] = useState(0);
    const [shares, setShares] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch additional data for the ticker symbol
                const data = await get_ticker_data(tickerSymbol);
                setTickerData(data);
                setOpeningPrice(data.history.Open[0]);
                const result = await get_balance();
                if (result.error) {
                    setError("Error fetching balance");
                } else {
                    setBalanceState(result.balance);
                }
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, []);

    async function handlePurchase(e){
        e.preventDefault();
        console.log("Purchase");
        try {
            const data = await buy_stock(tickerSymbol, shares, openingPrice);
            console.log("Purchase:", data);
            navigate("/Profile");
        } catch (error) {
            console.error("Error during purchase:", error.message);
        }
    };

    //console.log("data:", tickerData);
    //console.log(tickerSymbol);
    return (
        <div>
            {/* Put this shit in a box or something */}
            <h1>Buying a {tickerSymbol}</h1>
            <span>Your Current Balance: ${balance}</span>
            {/* Example: Display historical data, charts, company information, etc. */}
            <p>Opening Price = ${openingPrice} per share</p>
            <form onSubmit={handlePurchase}>
                <input
                    type="number" min="0"
                    placeholder="0"
                    value={shares}
                    onChange={(event) => setShares(event.target.value)}
                    required
                />
                <button type="submit">Purchase Shares</button>
            </form>
        </div>
    );
}
export default Buy;