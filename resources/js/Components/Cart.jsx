import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import Swal from 'sweetalert2';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState('');
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { currency, setCurrency } = useCurrency();

    const navigate = useNavigate();
    const { setCartCount } = useCart();
    const userId = localStorage.getItem('user_id');

    const fetchCart = async () => {
        try {
            const res = await axios.get(`/api/cart`, {
                params: userId ? { user_id: userId } : {},
            });

            if (res.data.success) {
                const cart = res.data.cart || [];
                setCartItems(cart);

                const calculatedSubtotal = cart.reduce(
                    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
                    0
                );
                setSubtotal(calculatedSubtotal);

                const storedDiscount = parseFloat(localStorage.getItem('coupon_amount') || '0');
                const minimumSpend = parseFloat(localStorage.getItem('minimum_spend') || '0');

                setDiscount(storedDiscount);

                if (storedDiscount && minimumSpend > calculatedSubtotal) {
                    localStorage.removeItem('coupon_amount');
                    localStorage.removeItem('minimum_spend');
                    setDiscount(0);
                    Swal.fire({
                        icon: 'info',
                        title: 'Coupon Alert',
                        text: "Coupon has been removed since the cart total is lesser than coupon's minimum amount",
                        showConfirmButton: true
                    });
                }

                const finalTotal = Math.max(calculatedSubtotal - storedDiscount, 0);
                setTotal(finalTotal);
                localStorage.setItem('totalAmount', finalTotal.toFixed(2));
            } else {
                setError('Failed to load cart items.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching cart data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleSelectItem = (productId) => {
        setSelectedItems((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;

        try {
            await axios.post('/api/cart/remove', {
                product_ids: selectedItems,
                user_id: userId,
                coupon: discount,
                total: subtotal
            });

            setSelectedItems([]);
            await fetchCart();
            setCartCount((prev) => Math.max(prev - selectedItems.length, 0));
        } catch (err) {
            console.error(err);
            setError('An error occurred while deleting items.');
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await axios.post('/api/cart/update-quantity', {
                product_id: productId,
                quantity: newQuantity,
                user_id: userId,
                total: subtotal,
                coupon: discount,
            });

            await fetchCart();
        } catch (err) {
            console.error(err);
            setError('An error occurred while updating quantity.');
        }
    };

    const applyCoupon = async (e) => {
        e.preventDefault();
        const coupon = e.target.coupon_discount.value;

        try {
            const res = await axios.post('/api/apply-coupon', {
                user_id: userId,
                cart_total: subtotal,
                coupon,
            });

            if (res.data.status === 'success') {
                const discountValue = parseFloat(res.data.discount || 0);
                localStorage.setItem('coupon_amount', discountValue);
                localStorage.setItem('minimum_spend', res.data.minimum);
                setDiscount(discountValue);
                fetchCart();

                Swal.fire({
                    icon: 'success',
                    title: 'Coupon Applied!',
                    text: res.data.message,
                    timer: 2000,
                    showConfirmButton: false
                });

                e.target.reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.message,
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'Failed to apply coupon. Please try again.',
            });
        }
    };

    const removeCoupon = async () => {
        localStorage.removeItem('coupon_amount');
        localStorage.removeItem('minimum_spend');
        setDiscount(0);
        await fetchCart();
        Swal.fire({
            icon: 'info',
            title: 'Coupon Alert',
            text: 'Coupon has been removed',
            timer: 3000,
            showConfirmButton: true
        });
    };

    return (
        <Container className="my-5">
            <h2 className="text-center fw-bold mb-4">🛒 My Shopping Cart</h2>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : cartItems.length === 0 ? (
                <div className="text-center py-5">
                    <h5 className="mb-3">Your cart is currently empty.</h5>
                    <Button variant="primary" size="lg" onClick={() => navigate('/products')}>
                        🛍️ Start Shopping
                    </Button>
                </div>
            ) : (
                <Row>
                    <Col md={7}>
                        {selectedItems.length > 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
                                <span>{selectedItems.length} item(s) selected</span>
                                <Button variant="danger" onClick={handleDeleteSelected}>
                                    🗑️ Remove from cart
                                </Button>
                            </div>
                        )}

                        {cartItems.map((item) => (
                            <Card key={item.id} className="mb-3 shadow-sm border-0">
                                <Card.Body className="d-flex align-items-start">
                                    <Form.Check
                                        type="checkbox"
                                        className="me-3 mt-2"
                                        checked={selectedItems.includes(item.product_id)}
                                        onChange={() => handleSelectItem(item.product_id)}
                                    />
                                    <div className="flex-grow-1">
                                        <h5>{item.product?.name}</h5>
                                        <p className="text-muted small mb-2">
                                            {item.product?.description || 'No description.'}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <strong className="text-primary">
                                                {currency} {parseFloat(item.product?.price || 0).toFixed(2)}
                                            </strong>
                                            <span>(Available Stock: {item.product?.stock})</span>
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.product_id, item.quantity - 1)
                                                    }
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </Button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleQuantityChange(item.product_id, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity >= item.product.stock}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </Col>

                    <Col md={5}>
                        <Card className="p-4 shadow-sm border-0 sticky-top" style={{ top: '80px' }}>
                            <h4 className="mb-3">🧾 Order Summary</h4>
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span>Total Amount</span>
                                <strong className="text-success">{currency} {subtotal.toFixed(2)}</strong>
                            </div>
                            {discount > 0 && (
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span>
                                        Discount{' '}
                                        <Button variant="outline-danger" size="sm" onClick={removeCoupon}>
                                            ❌
                                        </Button>
                                    </span>
                                    <strong className="text-success mb-0">-{currency} {discount.toFixed(2)}</strong>
                                </div>
                            )}
                            <div className="d-flex justify-content-between mb-2">
                                <span>Grand Total</span>
                                <strong className="text-dark">{currency} {total.toFixed(2)}</strong>
                            </div>
                            <hr />
                            {discount === 0 && (
                                <div className="mb-3">
                                    <Form className="d-flex flex-column gap-2" onSubmit={applyCoupon}>
                                        <Form.Control
                                            type="text"
                                            name="coupon_discount"
                                            placeholder="Enter Coupon Code"
                                            required
                                        />
                                        <Button type="submit" variant="info" size="md" className="w-100">
                                            Apply Coupon
                                        </Button>
                                    </Form>
                                </div>
                            )}
                            <Button variant="success" size="lg" className="w-100 mt-3">
                                ✅ Place Order
                            </Button>
                        </Card>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default Cart;
