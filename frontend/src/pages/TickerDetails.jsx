import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_ticker_data, get_ticker_data_timeframe, get_ticker_financials } from "../../../glue/yfinance_utils.js";
function TickerDetails() {
    const { tickerSymbol } = useParams(); // Get the ticker symbol from the URL params
    const [tickerData, setTickerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openingPrice, setOpeningPrice] = useState(0);
    const [high, setHigh] = useState(0);
    const [low, setLow] = useState(0);
    const [volume, setVolume] = useState(0);
    
    useEffect(() => {
        const fetchTickerData = async () => {
            try {
                // Fetch additional data for the ticker symbol
                const data = await get_ticker_data(tickerSymbol);
                setTickerData(data);
                setOpeningPrice(data.history.Open[0]);
                setHigh(data.history.High[0]);
                setLow(data.history.Low[0]);
                setVolume(data.history.Volume[0]);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchTickerData();
    }, [tickerSymbol]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log(tickerData);
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Ticker Details for {tickerSymbol}</h1>
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", width: "calc(33.33% - 20px)" }}>
                <p>Opening Price = ${openingPrice} per share</p>
                <p>High = ${high}</p>
                <p>Low = ${low}</p>
                <p>Volume = {volume}</p>
            </div>
        </div>
    );
}

export default TickerDetails;