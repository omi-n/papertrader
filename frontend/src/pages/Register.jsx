import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./../styles/Authentication.css";
import { sign_up } from '../../../glue/auth_utils';

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    const data = await sign_up(username, password, email);
    navigate("/");
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <div>Error: {error}</div>}
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}

export default Register;