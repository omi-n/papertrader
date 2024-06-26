import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import "./../styles/Register.css";
import { sign_up } from '../../../glue/auth_utils';

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const data = await sign_up(username, password, email);
    navigate("/Login");
  };

  return (
    <div className='container-fluid'>
      <h2>Register</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        </div>
        <div className="mb-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        </div>
        <div className="mb-3">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </div>
        <button type="submit">Signup</button>
      </form>
      <Link to="/login">Login</Link>
    </div>
    
  );
}

export default Register;