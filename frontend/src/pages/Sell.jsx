
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