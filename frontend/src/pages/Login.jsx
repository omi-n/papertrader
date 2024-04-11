import { useState } from "react"
import "./../styles/Login.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e) {
        // login handler
    }
    return(
        <>
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email" 
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
                <button type="submit">Login</button>
            </form>
        </div>
        </>
    );
};

export default Login;