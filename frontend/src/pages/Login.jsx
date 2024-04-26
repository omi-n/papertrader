import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./../styles/Login.css"
import { log_in, verify_token, get_access_token, get_refresh_token, is_logged_in } from "../../../glue/auth_utils";
import { setCookie, getCookie } from "../../../glue/cookie_utils";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        const data = await log_in(username, password);
        //const worked = await is_logged_in();
        //console.log("logged in:", worked);
        //console.log("access token:", get_access_token());
        navigate("/");
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