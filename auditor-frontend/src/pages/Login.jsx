import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/v1/auth/login', credentials);
            localStorage.setItem('token', res.data.token); // Store the "Passport"
            onLoginSuccess();
        } catch (err) {
            alert("Login failed! Check your credentials.");
        }
    };

    return (
        <div className="container mt-5" style={{maxWidth: '400px'}}>
            <div className="card shadow p-4">
                <h3>A11y Auditor Login</h3>
                <form onSubmit={handleSubmit}>
                    <input className="form-control mb-2" placeholder="Username" 
                           onChange={e => setCredentials({...credentials, username: e.target.value})} />
                    <input className="form-control mb-3" type="password" placeholder="Password" 
                           onChange={e => setCredentials({...credentials, password: e.target.value})} />
                    <button className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;