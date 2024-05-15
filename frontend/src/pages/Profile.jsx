import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verify_token, refresh_token, is_logged_in, log_out } from "../../../glue/auth_utils";
import { get_balance, set_balance } from "../../../glue/user_utils";

function Profile() {
    const [balance, setBalanceState] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddButtons, setShowAddButtons] = useState(false);
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
                    if (result.error) {
                        setError("Error fetching balance");
                    } else {
                        setBalanceState(result.balance);
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
            <div>Profile</div>
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
        </>
    );
}

export default Profile;