import { useState } from "react"
import "./../styles/Login.css"
import { log_in, get_access_token, get_refresh_token, verify_token } from "../../../glue/auth_utils";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        const data = log_in(email, password);
        console.log("data: ", data);
        console.log("Refresh: ", get_refresh_token());
        console.log("Access: ", get_access_token());
        console.log("Verify: ", verify_token());
    }
    return(
        <>
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    // change to username 
                    type="text" 
                    placeholder="Enter email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <input
                    type="password" 
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <button type="submit" onSubmit={handleLogin}>Login</button>
            </form>
        </div>
        </>
    );
};

export default Login;