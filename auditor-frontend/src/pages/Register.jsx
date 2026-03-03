import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            await axios.post('http://localhost:8080/api/v1/auth/register', {
                username: formData.username,
                email: formData.email, 
                password: formData.password
            });
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data || "Registration failed");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg rounded-4 border-0 bg-body-tertiary" style={{ width: '400px' }}>
                <h3 className="fw-bold text-center mb-4">Create Account</h3>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="small fw-bold text-muted">Username</label>
                        <input className="form-control" required
                            onChange={e => setFormData({...formData, username: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="small fw-bold text-muted">Email</label>
                        <input className="form-control" required
                            onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="small fw-bold text-muted">Password</label>
                        <input className="form-control" type="password" required
                            onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div className="mb-3">
                        <label className="small fw-bold text-muted">Confirm Password</label>
                        <input className="form-control" type="password" required
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                    </div>
                    <button className="btn btn-primary w-100 fw-bold py-2 mb-3">Register</button>
                    <p className="text-center small mb-0">
                        Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;