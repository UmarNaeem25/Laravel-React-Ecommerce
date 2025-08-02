import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const About = () => {
    return (
        <div
            style={{
                background: 'linear-gradient(to right, #f9f9f9, #eef2f3)',
                minHeight: '100vh',
                padding: '60px 0'
            }}
        >
            <Container>
                <Card
                    className="shadow-lg border-0"
                    style={{
                        borderRadius: '20px',
                        backgroundColor: 'white',
                        padding: '40px'
                    }}
                >
                    <Card.Body>
                        <Card.Title as="h1" className="mb-4 text-center fw-bold">
                            About Us
                        </Card.Title>

                        <Card.Text className="fs-5 text-muted mb-5 text-center">
                            Welcome to our <strong>Laravel + React JS</strong> App! This project showcases how modern frontend technologies like React can work seamlessly with robust backends such as Laravel.
                        </Card.Text>

                        <Row className="mb-4">
                            <Col md={6} className="mb-4">
                                <h4 className="fw-semibold">💡 Our Mission</h4>
                                <p className="text-muted">
                                    To create powerful, user-friendly, and scalable applications by combining the best technologies from both frontend and backend ecosystems.
                                </p>
                            </Col>
                            <Col md={6} className="mb-4">
                                <h4 className="fw-semibold">🛠️ Technologies Used</h4>
                                <ul className="text-muted" style={{ paddingLeft: '1.2rem' }}>
                                    <li>React (Frontend)</li>
                                    <li>Laravel (Backend)</li>
                                    <li>Bootstrap 5 (UI/UX)</li>
                                    <li>Axios (HTTP Client)</li>
                                    <li>SweetAlert2 (Alerts)</li>
                                </ul>
                            </Col>
                        </Row>

                        <div className="text-center mt-5">
                            <h5 className="fw-semibold mb-3">🚀 Want to Collaborate?</h5>
                            <p className="text-muted mb-4">
                                We're always open to new ideas, contributions, and improvements. Let’s build something amazing together!
                            </p>
                            <NavLink
                                to="/contact"
                                style={{
                                    display: 'inline-block',
                                    padding: '12px 30px',
                                    backgroundColor: '#0d6efd',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '500'
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#0b5ed7')}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#0d6efd')}
                            >
                                Contact Us
                            </NavLink>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default About;
