import React, { useState, useEffect } from "react";
import { get_tickers, get_ticker_data } from "../../../glue/yfinance_utils.js";
import { useNavigate } from "react-router-dom";
import "./../styles/Ticker.css";
import { Button } from "bootstrap";

function Ticker() {
    const [allTickers, setAllTickers] = useState([]);
    const [tickers, setTickers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [openingPrices, setOpeningPrices] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchError, setSearchError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await get_tickers(currentPage);
                const data = response.results;
                console.log("Fetched data:", data);
                setAllTickers(data);
                setTickers(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ticker data:', error);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        const fetchOpeningPrices = async () => {
            const prices = {};
            for (const ticker of allTickers) {
                try {
                    const openingPrice = await fetchTickerData(ticker.ticker);
                    prices[ticker.ticker] = openingPrice;
                } catch (error) {
                    console.error(`Error fetching opening price for ${ticker.ticker}:`, error);
                }
            }
            setOpeningPrices(prices);
        };

        if (allTickers.length > 0) {
            fetchOpeningPrices();
        }
    }, [allTickers]);

    const fetchTickerData = async (tickerSymbol) => {
        try {
            const tickerData = await get_ticker_data(tickerSymbol);
            if (!tickerData || Object.keys(tickerData).length === 0) {
                return null;
            }
            return tickerData.history.Open[0];
        } catch (error) {
            console.error(`Error fetching ticker data for ${tickerSymbol}:`, error);
            return null;
        }
    };

    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handleSearch = async () => {
        const capitalizedSearchQuery = searchQuery.toUpperCase();
        try {
            const tickerData = await get_ticker_data(capitalizedSearchQuery);
            if (!tickerData || Object.keys(tickerData.history).every(key => tickerData.history[key].length === 0)) {
                setSearchResults([]);
                setSearchError('No data found for the provided ticker symbol.');
                return;
            }
            setSearchResults([{ ticker: capitalizedSearchQuery, openingPrice: tickerData.history.Open[0] }]);
            setSearchError('');
        } catch (error) {
            console.error(`Error fetching ticker data for ${capitalizedSearchQuery}:`, error);
            setSearchResults([]);
            setSearchError('Error fetching ticker data. Please try again later.');
        }
    };

    const handleMoreInfoClick = (ticker) => {
        navigate(`/tickerdetails/${ticker}`);
    };

    const handleBuyClick = (ticker) => {
        navigate(`/buy/${ticker}`);
    };

    const handleSellClick = (ticker) => {
        navigate(`/sell/${ticker}`);
    };

    const handleReturnToAllStocks = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSearchError('');
    };

    return (
        <div>
            <h1 className="h">Stocks</h1>
            <div className="container-fluid">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter ticker symbol" />
                <button onClick={handleSearch}>Search</button>
            </div>
            {searchError && <div>Error: {searchError}</div>}
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && !searchError && (tickers.length === 0 ? (
                <div>No Tickers Found.</div>
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                            <div key={index} className={`ticker-card${searchResults.length > 0 ? '-search' : ''} ${index === 9 ? 'center-ticker' : ''}`}>
                                <div>
                                    <p>Ticker: {result.ticker}</p>
                                    <p>Opening Price: {result.openingPrice !== undefined ? (result.openingPrice).toFixed(2) : "Loading..."}</p>
                                    <p><button onClick={() => handleBuyClick(result.ticker)}>Buy</button></p>
                                    <p><button onClick={() => handleSellClick(result.ticker)}>Sell</button></p>
                                    <p><button onClick={() => handleMoreInfoClick(result.ticker)}>More Info</button></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        tickers.map((ticker, index) => (
                            <div key={index} className={`ticker-card ${index === 9 ? 'center-ticker' : ''}`}>
                                <div>
                                    <p>Ticker: {ticker.ticker}</p>
                                    <p>Opening Price: {openingPrices[ticker.ticker] !== undefined ? (openingPrices[ticker.ticker]).toFixed(2) : "Loading..."}</p>
                                    <p><button onClick={() => handleBuyClick(ticker.ticker)}>Buy</button></p>
                                    <p><button onClick={() => handleSellClick(ticker.ticker)}>Sell</button></p>
                                    <p><button onClick={() => handleMoreInfoClick(ticker.ticker)}>More Info</button></p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ))} 
            {!loading && !error && !searchError && <div><button onClick={nextPage}>Next Page</button></div>}
            {searchResults.length > 0 && <div><button onClick={handleReturnToAllStocks}>Return to All Stocks</button></div>}
            {searchResults.length == 0 && <div><button onClick={handleReturnToAllStocks}>Return to All Stocks</button></div>}
        </div>
    );
}
export default Ticker;