import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button, Modal } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import { useAuth } from '../context/AuthContext';
import { BoxArrowRight, Cart3 } from 'react-bootstrap-icons';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

const Header = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { cartCount, setCartCount } = useCart();
    const { currency, setCurrency } = useCurrency();
    const [currencies, setCurrencies] = useState([]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCartCount(0);
            logout();
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const isActive = (path) => location.pathname === path;

    // ✅ Fetch currencies on mount
    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const res = await axios.get('/api/currencies');
                setCurrencies(res.data.currencies);
            } catch (error) {
                console.error('Failed to fetch currencies:', error);
            }
        };

        fetchCurrencies();
    }, []);

    return (
        <>
            <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm py-3">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
                        🚀 Laravel React
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbar-nav" />
                    <Navbar.Collapse id="navbar-nav">
                        <Nav className="me-auto">
                            {/* Nav Links */}
                        </Nav>
                        <Nav.Link className="px-3 text-white d-flex align-items-center">
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="form-select form-select-sm bg-light text-dark"
                                style={{ width: '70px', borderRadius: '20px' }}
                            >
                                {currencies.map((curr) => (
                                    <option key={curr.id} value={curr.symbol}>
                                        {curr.symbol}
                                    </option>
                                ))}
                            </select>
                        </Nav.Link>

                        {/* Auth Section */}
                        <Nav className="ms-auto align-items-center gap-3">
                            {user ? (
                                <>
                                    <span className="navbar-text text-white fw-semibold">
                                        👋 Welcome, <span className="text-warning">{user.name}</span>
                                    </span>
                                    <Button
                                        variant="light"
                                        size="sm"
                                        className="d-flex align-items-center gap-2 fw-semibold"
                                        onClick={handleShow}
                                        style={{ padding: '6px 14px', borderRadius: '20px' }}
                                    >
                                        <BoxArrowRight />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link
                                        as={Link}
                                        to="/login"
                                        className={`btn btn-outline-light btn-sm rounded-pill px-3 ${isActive('/login') ? 'active fw-bold border-2' : ''}`}
                                    >
                                        Login
                                    </Nav.Link>
                                    <Nav.Link
                                        as={Link}
                                        to="/register"
                                        className={`btn btn-light btn-sm rounded-pill px-3 fw-semibold ${isActive('/register') ? 'active border border-3 border-warning' : ''}`}
                                    >
                                        Register
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Logout Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Logout Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-6">
                    Are you sure you want to logout? You’ll be redirected to the login page.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleLogout();
                            handleClose();
                        }}
                    >
                        <BoxArrowRight className="me-2" />
                        Confirm Logout
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Header;
