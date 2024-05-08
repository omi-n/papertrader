import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { get_ticker_data, get_ticker_data_timeframe, get_ticker_financials } from "../../../glue/yfinance_utils.js";

function Sell(){
    const { tickerSymbol } = useParams(); // Get the ticker symbol from the URL params

    return (
        <div>
            <h1>Selling your {tickerSymbol}</h1>
            {/* Render detailed information about the ticker */}
            {/* Example: Display historical data, charts, company information, etc. */}
            {/* Example: <p>Opening Price: {tickerData.openingPrice}</p> */}
        </div>
    );
}
export default Sell;