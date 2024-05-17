import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verify_token, refresh_token, is_logged_in, log_out } from "../../../glue/auth_utils";
import { get_balance, get_transactions, set_balance, get_stocks } from "../../../glue/user_utils";

function Profile() {
    const [balance, setBalanceState] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddButtons, setShowAddButtons] = useState(false);
    const [stocks, setStocks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
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
                    const result = await get_balance();
                    // get stocks
                    const s = await get_stocks();
                    // get transactions
                    const t = await get_transactions();
                    if (result.error) {
                        setError("Error fetching balance");
                    } else {
                        setBalanceState(result.balance);
                        setStocks(s);
                        setTransactions(t);
                    }
                }
            } catch (error) {
                setError("Error fetching balance");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleAddToBalance = async (amount) => {
        try {
            setLoading(true);
            const result = await set_balance(amount);
            if (result.error) {
                setError("Error adding to balance");
            } else {
                setBalanceState(prevBalance => prevBalance + amount);
            }
        } catch (error) {
            setError("Error adding to balance");
        } finally {
            setLoading(false);
        }
    };

    const handleResetBalance = async () => {
        try {
            setLoading(true);
            const result = await set_balance(-balance);
            if (result.error) {
                setError("Error resetting balance");
            } else {
                setBalanceState(0);
            }
        } catch (error) {
            setError("Error resetting balance");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAddButtons = () => {
        setShowAddButtons(prevState => !prevState);
    };

    return (
        <>
            <h1>Profile</h1>
            <div>
                <div>
                    <span>Current Balance: {balance}</span>
                    <button onClick={handleToggleAddButtons}>+</button>
                    {showAddButtons && (
                        <>
                            <button onClick={() => handleAddToBalance(10)}>+10</button>
                            <button onClick={() => handleAddToBalance(100)}>+100</button>
                            <button onClick={() => handleAddToBalance(1000)}>+1000</button>
                        </>
                    )}
                </div>
                <button onClick={handleResetBalance}>Reset Balance</button>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <h1>Transactions</h1>
            {transactions.length === 0 ? (
                // Render this block when there are no transactions
                <div>No transactions available</div>
            ) : (
                // Render this block when there are transactions
                transactions.map((transac, index) => (
                <div key={index}>
                    {transac.transaction_type === 'buy' ? (<p>You bought {transac.amount} shares of {transac.ticker} priced at ${transac.price} a share.</p>)
                    : (<p>You sold {transac.amount} shares of {transac.ticker} at ${transac.price} a share.</p>)}
                </div>
                ))
            )}
        </>
    );
}

export default Profile;