import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [cartState, setCartState] = useState([]);
    const [modal, setModal] = useState({ show: false, product: null, type: '' });
    const [loginModal, setLoginModal] = useState(false);
    const { currency, setCurrency } = useCurrency();

    const { cartCount, fetchCartCount, setCartCount } = useCart();
    const userId = localStorage.getItem('user_id');
    const navigate = useNavigate();

    const fetchProducts = async (page = 1) => {
        try {
            const res = await axios.get(`/api/products?page=${page}${userId ? `&user_id=${userId}` : ''}`);
            const data = res.data;

            const productsList = data?.data || [];
            const addedCartIds = productsList
                .filter(p => p.is_added_to_cart)
                .map(p => p.id);

            setProducts(productsList);
            setCartState(addedCartIds);
            setCurrentPage(data?.current_page || 1);
            setLastPage(data?.last_page || 1);
            setError('');
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Something went wrong while loading products.');
        }
    };

    const showFeedback = (product, type) => {
        setModal({ show: true, product, type });
        setTimeout(() => {
            setModal({ show: false, product: null, type: '' });
        }, 2000);
    };

    const addToCart = async (product) => {
        if (!userId) {
            setLoginModal(true);
            return;
        }

        try {
            await axios.post('/api/cart/add', {
                product_id: product.id,
                quantity: 1,
                user_id: userId
            });

            setCartState(prev => [...prev, product.id]);
            setCartCount(prev => prev + 1);
            showFeedback(product, 'added to');
        } catch (err) {
            console.error('Add to cart failed:', err);
        }
    };

    const removeFromCart = async (product) => {
        if (!userId) {
            setLoginModal(true);
            return;
        }

        try {
            await axios.post('/api/cart/remove', {
                product_id: product.id,
                user_id: userId
            });

            setCartState(prev => prev.filter(id => id !== product.id));
            setCartCount(prev => Math.max(0, prev - 1));
            showFeedback(product, 'removed from');
        } catch (err) {
            console.error('Remove from cart failed:', err);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 fw-bold">📦 Our Products</h2>

            {error ? (
                <div className="text-center my-5 text-danger">{error}</div>
            ) : products.length === 0 ? (
                <div className="text-center my-5 text-muted">No products available.</div>
            ) : (
                <>
                    <Row className="g-4 mt-4 justify-content-center">
                        {products.map(product => {
                            const isAdded = cartState.includes(product.id);
                            return (
                                <Col md={4} lg={3} key={product.id}>
                                    <Card className="shadow-sm border-0 h-100">
                                        <Card.Body className="d-flex flex-column justify-content-between">
                                            <div>
                                                <Card.Title className="fw-bold">{product.name}</Card.Title>
                                                <Card.Text>
                                                    {product.description || 'No description available.'}
                                                </Card.Text>
                                            </div>
                                            <div className="mt-3 d-flex justify-content-between align-items-center">
                                                <span className="text-primary fw-semibold">
                                                    {currency} {parseFloat(product.price || 0).toFixed(2)}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant={isAdded ? 'danger' : 'outline-success'}
                                                    onClick={() =>
                                                        isAdded ? removeFromCart(product) : addToCart(product)
                                                    }
                                                >
                                                    {isAdded ? 'Remove' : 'Add to Cart'}
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>

                    {lastPage > 1 && (
                        <div className="d-flex justify-content-center mt-4 flex-wrap gap-2">
                            {Array.from({ length: lastPage }, (_, i) => i + 1).map(pageNum => (
                                <Button
                                    key={pageNum}
                                    variant={pageNum === currentPage ? 'primary' : 'outline-primary'}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Feedback Modal */}
            <Modal
                show={modal.show}
                onHide={() => setModal({ show: false, product: null, type: '' })}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>🛒 Cart Update</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>
                        <strong>{modal.product?.name}</strong> has been{' '}
                        <span className="text-success">{modal.type}</span> your cart.
                    </p>
                </Modal.Body>
            </Modal>

            {/* Login Modal */}
            <Modal
                show={loginModal}
                onHide={() => setLoginModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>🔐 Login Required</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <p>You need to <strong>log in</strong> to add or remove items from your cart.</p>
                    <Button variant="primary" onClick={() => {
                        setLoginModal(false);
                        navigate('/login');
                    }}>
                        Go to Login
                    </Button>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Products;
