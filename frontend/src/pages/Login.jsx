import { useState } from "react"
import "./../styles/Login.css"
import { log_in, verify_token, get_access_token, get_refresh_token, is_logged_in } from "../../../glue/auth_utils";
import { setCookie, getCookie } from "../../../glue/cookie_utils";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();
        const data = await log_in(email, password);
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