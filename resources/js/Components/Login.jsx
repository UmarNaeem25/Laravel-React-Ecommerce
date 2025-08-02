import React, { useState } from 'react';
import axios from '../axios';
import { useNavigate , NavLink } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { setCart } = useCart();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/login', form);
            const token = res.data.token;
            setUser(res.data.user);
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', res.data.user.id);
            
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: res.data.message
            });

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: err.response?.data?.message || 'Invalid credentials'
            });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-primary">Login</h3>
                    <p className="text-muted">Access your account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="example@domain.com"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button className="btn btn-primary" type="submit">Login</button>
                    </div>
                </form>
                <div className="mt-3 text-center">
                    <small className="text-muted">Don’t have an account? <NavLink to="/register">Register</NavLink></small>
                </div>
            </div>
        </div>
    );
};

export default Login;
