import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_ticker_data, get_ticker_data_timeframe, get_ticker_financials } from "../../../glue/yfinance_utils.js";
function TickerDetails() {
    const { tickerSymbol } = useParams(); // Get the ticker symbol from the URL params

    const [tickerData, setTickerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openingPrice, setOpeningPrice] = useState(0);
    
    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                // Fetch additional data for the ticker symbol
                const data = await get_ticker_data(tickerSymbol);
                setTickerData(data);
                setOpeningPrice(data.history.Open[0]);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchTickerData();
        console.log("data:", tickerData);
    }, [tickerSymbol]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Ticker Details for {tickerSymbol}</h1>
            {/* Render detailed information about the ticker */}
            {/* Example: Display historical data, charts, company information, etc. */}
            <p>Opening Price = {openingPrice}</p>
        </div>
    );
}

export default TickerDetails;