import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verify_token, refresh_token, is_logged_in, log_out } from "../../../glue/auth_utils";
import { get_balance, get_transactions, set_balance } from "../../../glue/user_utils";
import "./../styles/Profile.css";

function Profile() {
    const [balance, setBalanceState] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddButtons, setShowAddButtons] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    const username = localStorage.getItem('username');

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
                    const t = await get_transactions();
                    if (result.error) {
                        setError("Error fetching balance");
                    } else {
                        setBalanceState(result.balance);
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
            <h1 className="h">Welcome, {username}!</h1>       
            <div>
                <div className="balance-container">
                    <span>Your Current Balance is: {balance}</span>
                    <button onClick={handleToggleAddButtons} className="round-button">+</button>
                </div>
                {showAddButtons && (
                    <div className="add-buttons-container">
                        <button onClick={() => handleAddToBalance(10)}>+10</button>
                        <button onClick={() => handleAddToBalance(100)}>+100</button>
                        <button onClick={() => handleAddToBalance(1000)}>+1000</button>
                    </div>
                )}
                <div className={showAddButtons ? "reset-button-container show" : "reset-button-container"}>
                    <button onClick={handleResetBalance}>Reset Balance</button>
                </div>
            </div>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            <div className="transaction-container">
            <h1>Transactions</h1>
            {transactions.length === 0 ? (
                <div>No transactions available</div>
            ) : (
                transactions.map((transac, index) => (
                <div key={index}>
                    {transac.transaction_type === 'buy' ? (<p>You bought {transac.amount} shares of {transac.ticker} priced at ${transac.price} a share.</p>)
                    : (<p>You sold {transac.amount} shares of {transac.ticker} at ${transac.price} a share.</p>)}
                </div>
                ))
            )}
            </div>
        </>
    );
}

export default Profile;