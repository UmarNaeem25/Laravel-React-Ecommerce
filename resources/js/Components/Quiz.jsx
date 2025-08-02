import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Container, Card, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Quiz() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState(() => JSON.parse(localStorage.getItem('quiz_answers')) || {});
    const [page, setPage] = useState(() => Number(localStorage.getItem('quiz_page')) || 1);
    const [lastPage, setLastPage] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get(`/api/questions?page=${page}`).then(res => {
            setQuestions(res.data.data);
            setLastPage(res.data.last_page);
        });
    }, [page]);

    useEffect(() => {
        localStorage.setItem('quiz_answers', JSON.stringify(answers));
    }, [answers]);

    useEffect(() => {
        localStorage.setItem('quiz_page', page);
    }, [page]);

    const answerQuestion = (questionId, option) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const submitQuiz = () => {
        setSubmitting(true);
        axios.post('/api/submit-quiz', { user_id: userId, answers }).then(res => {
            localStorage.setItem('quiz', 'done');
            localStorage.removeItem('quiz_answers');
            localStorage.removeItem('quiz_page');
            Swal.fire({
                icon: 'success',
                title: '🎉 Quiz Completed',
                html: `<p>You Scored: <strong>${res.data.score}</strong> / ${res.data.total}</p>`,
            }).then(() => navigate('/result'));
        }).catch(() => {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Submission failed.' });
        }).finally(() => setSubmitting(false));
    };

    return (
        <Container className="mt-5 mb-5">
            <Card className="shadow-lg mb-4">
                <Card.Body>
                    <h3 className="text-center fw-bold mb-3">📝 Take the Quiz</h3>
                </Card.Body>
            </Card>

            {questions.map((q, i) => (
                <Card key={q.id} className="mb-4 shadow-sm border-0 rounded-4">
                    <Card.Body>
                        <Card.Title className="mb-3 fs-5 text-dark">
                            <strong>Q{(page - 1) * 6 + i + 1}:</strong> {q.question}
                        </Card.Title>
                        {['A', 'B', 'C', 'D'].map(opt => {
                            const value = q[`option_${opt.toLowerCase()}`];
                            const selected = answers[q.id] === opt;
                            return (
                                <div
                                    key={opt}
                                    className={`p-3 mb-2 rounded-3 border ${selected ? 'bg-primary bg-opacity-10 border-primary' : 'border-light'}`}
                                    role="button"
                                    onClick={() => answerQuestion(q.id, opt)}
                                >
                                    <Form.Check
                                        type="radio"
                                        name={`q${q.id}`}
                                        label={`${opt}: ${value}`}
                                        checked={selected}
                                        readOnly
                                    />
                                </div>
                            );
                        })}
                    </Card.Body>
                </Card>
            ))}

            <Row className="justify-content-center mt-4">
                {page > 1 && (
                    <Col xs="auto">
                        <Button variant="outline-primary rounded-pill px-4" onClick={() => setPage(p => p - 1)}>
                            ⬅ Previous
                        </Button>
                    </Col>
                )}
                <Col xs="auto">
                    {page < lastPage ? (
                        <Button variant="primary rounded-pill px-4" onClick={() => setPage(p => p + 1)}>
                            Next ➡
                        </Button>
                    ) : (
                        <Button variant="success rounded-pill px-4" onClick={submitQuiz} disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" /> Submitting...
                                </>
                            ) : '✅ Submit Quiz'}
                        </Button>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default Quiz;
