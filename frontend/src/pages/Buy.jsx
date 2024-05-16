import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_ticker_data, get_ticker_data_timeframe, get_ticker_financials } from "../../../glue/yfinance_utils.js";
import { get_balance, set_balance } from "../../../glue/user_utils";

function Buy(){
    const { tickerSymbol } = useParams(); // Get the ticker symbol from the URL params
    const [tickerData, setTickerData] = useState(null);
    const [openingPrice, setOpeningPrice] = useState(0);
    const [balance, setBalanceState] = useState(0);
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


    console.log("data:", tickerData);
    console.log(tickerSymbol);
    return (
        <div>
            {/* Put this shit in a box or something */}
            <h1>Buying a {tickerSymbol}</h1>
            <span>Your Current Balance: ${balance}</span>
            {/* Example: Display historical data, charts, company information, etc. */}
            <p>Opening Price = {openingPrice}</p>
        </div>
    );
}
export default Buy;