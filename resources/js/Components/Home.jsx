import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #e3f2fd, #fce4ec)',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: '50px',
                paddingBottom: '50px',
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        <Card className="shadow-lg border-0 rounded-4 p-4 bg-white">
                            <Card.Body className="text-center px-md-5 py-5">
                                <div style={{ fontSize: '3rem', animation: 'wave 2s infinite' }}>
                                    👋
                                </div>
                                <Card.Title className="fs-1 fw-bold mb-4 mt-3">
                                    Welcome to Laravel + React JS
                                </Card.Title>
                                <Card.Text className="text-muted fs-5 mb-4">
                                    This is a modern full-stack starter using
                                    <strong> Laravel</strong>, <strong>React</strong>, <strong>Vite</strong>, and <strong>Bootstrap</strong>.
                                </Card.Text>
                                <Button
                                    as={Link}
                                    to="/about"
                                    variant="primary"
                                    size="lg"
                                    className="px-4 py-2 rounded-pill fw-semibold"
                                >
                                    Learn More 🚀
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <style>
                {`
                @keyframes wave {
                    0% { transform: rotate(0deg); }
                    15% { transform: rotate(14deg); }
                    30% { transform: rotate(-8deg); }
                    40% { transform: rotate(14deg); }
                    50% { transform: rotate(-4deg); }
                    60% { transform: rotate(10deg); }
                    70% { transform: rotate(0deg); }
                    100% { transform: rotate(0deg); }
                }
                `}
            </style>
        </div>
    );
};

export default Home;
