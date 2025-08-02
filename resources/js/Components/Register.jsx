import React, { useState } from 'react';
import axios from '../axios';
import { useNavigate , NavLink  } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const { setUser } = useAuth();

    const navigate = useNavigate();

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await axios.get('/sanctum/csrf-cookie');
            const res = await axios.post('/api/register', form);
            const token = res.data.token;
            setUser(res.data.user);
            if (token) {
                localStorage.setItem('token', token);
                localStorage.setItem('user_id', res.data.user.id);
            }

            Swal.fire({
                icon: 'success',
                title: 'Registered Successfully',
                text: res.data.message
            });

            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.message || 'Something went wrong'
            });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '450px' }}>
                <div className="text-center mb-4">
                    <h3 className="fw-bold text-success">Register</h3>
                    <p className="text-muted">Create a new account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control"
                            placeholder="Your full name"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="form-control"
                            placeholder="you@example.com"
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
                            placeholder="Enter a password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password_confirmation" className="form-label">Confirm Password</label>
                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            className="form-control"
                            placeholder="Re-enter your password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="d-grid">
                        <button className="btn btn-success" type="submit">Register</button>
                    </div>
                </form>
                <div className="mt-3 text-center">
                    <small className="text-muted">
                        Already have an account? <NavLink to="/login">Login</NavLink>
                    </small>
                </div>

            </div>
        </div>
    );
};

export default Register;
