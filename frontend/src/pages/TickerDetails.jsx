import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_ticker_data } from "../../../glue/yfinance_utils.js";
import "./../styles/TickerDetails.css";
import { useNavigate } from "react-router-dom";

function TickerDetails() {
    const { tickerSymbol } = useParams(); // Get the ticker symbol from the URL params
    const [tickerData, setTickerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openingPrice, setOpeningPrice] = useState(0);
    const [high, setHigh] = useState(0);
    const [low, setLow] = useState(0);
    const [volume, setVolume] = useState(0);
    const navigate = useNavigate(); // Hook for navigation

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

    const handleBuyClick = () => {
        navigate(`/buy/${tickerSymbol}`);
    };

    const handleSellClick = () => {
        navigate(`/sell/${tickerSymbol}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Ticker Details for {tickerSymbol}</h1>
            <div className="details-card">
                <p>Opening Price = ${openingPrice.toFixed(2)} per share</p>
                <p>High = ${high.toFixed(2)}</p>
                <p>Low = ${low.toFixed(2)}</p>
                <p>Volume = {volume}</p>
                <div>
                    <button onClick={handleBuyClick} style={{ marginRight: "10px" }}>Buy</button>
                    <button onClick={handleSellClick} style={{ marginLeft: "10px" }}>Sell</button>
                </div>
            </div>
        </div>
    );
}

export default TickerDetails;