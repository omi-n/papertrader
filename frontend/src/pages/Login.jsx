import { useState } from "react"
import "./../styles/Login.css"
import { log_in, verify_token, get_access_token, get_refresh_token, is_logged_in } from "../../../glue/auth_utils";
import { setCookie, getCookie } from "../../../glue/cookie_utils";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        const data = await log_in(username, password);
    }
    return(
        <>
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    // change to username 
                    type="text" 
                    placeholder="Enter Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
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