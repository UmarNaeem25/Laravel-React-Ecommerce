import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { Button } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Result = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const [totalScore, setTotalScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const userID = localStorage.getItem('user_id');

    useEffect(() => {
        fetchResults(currentPage);
    }, [currentPage]);

    const fetchResults = async (pageNumber) => {
        setLoading(true);
        try {
            const res = await axios.get('api/results', {
                params: { user_id: userID, page: pageNumber }
            });

            const { results, totalScore, totalQuestions } = res.data;

            setResults(results.data || []);
            setCurrentPage(results.current_page);
            setLastPage(results.last_page);
            setPerPage(results.per_page);

            setTotalScore(totalScore || 0);
            setTotalQuestions(totalQuestions || 0);
        } catch (error) {
            console.error('Error fetching results:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < lastPage) setCurrentPage(currentPage + 1);
    };

    if (loading) return <p className="text-center">Loading your results...</p>;

    return (
        <div className="container py-4">
            <div className="text-center mb-5">
                <h3 className="fw-bold text-primary">You scored {totalScore} out of {totalQuestions}</h3>
            </div>

            {results.length === 0 ? (
                <p className="text-center">No quiz results found.</p>
            ) : (
                results.map((result, index) => {
                    const q = result.question || {};
                    const marked = (result.marked_option || '').trim().toUpperCase();
                    const correct = (q.correct || '').trim().toUpperCase();

                    const questionNumber = (perPage * (currentPage - 1)) + index + 1;

                    return (
                        <div key={result.id} className="card mb-4 border shadow-sm">
                            <div className="card-body">
                                <h5 className="mb-3">
                                    <span className="fw-semibold text-dark">
                                        Q{questionNumber}:
                                    </span> {q.text}
                                </h5>

                                <div className="list-group">
                                    {['A', 'B', 'C', 'D'].map((optionKey) => {
                                        const optionText = q[`option_${optionKey.toLowerCase()}`];
                                        const isSelected = marked === optionKey;
                                        const isCorrect = correct === optionKey;

                                        let bgClass = 'bg-light';
                                        if (isSelected) {
                                            bgClass = isCorrect ? 'bg-success bg-opacity-25' : 'bg-danger bg-opacity-25';
                                        } else if (isCorrect) {
                                            bgClass = 'bg-info bg-opacity-25';
                                        }

                                        return (
                                            <div
                                                key={optionKey}
                                                className={`list-group-item d-flex align-items-center ${bgClass} rounded-2 mb-2`}
                                            >
                                                <input
                                                    className="form-check-input me-2"
                                                    type="radio"
                                                    name={`question-${result.id}`}
                                                    value={optionKey}
                                                    checked={isSelected}
                                                    disabled
                                                />
                                                <div className="flex-grow-1">
                                                    {optionText}
                                                </div>

                                                {isSelected && (
                                                    <span className="badge bg-warning text-dark ms-2">Your Answer</span>
                                                )}

                                                {isCorrect && (
                                                    <span className="badge bg-success ms-2">Correct</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-3">
                                    {marked === correct ? (
                                        <span className="text-success fw-bold">✅ You got it right!</span>
                                    ) : (
                                        <span className="text-danger fw-bold">
                                            ❌ Oops! Correct Answer: <strong>{correct}</strong>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}

            {results.length > 0 && (
                <div className="d-flex gap-3 justify-content-center align-items-center mt-5">
                    <Button variant="secondary" disabled={currentPage === 1} onClick={handlePrev}>
                        <FaArrowLeft className="me-2" /> Previous
                    </Button>

                    <span className="text-muted">Page {currentPage} of {lastPage}</span>

                    <Button variant="primary" disabled={currentPage === lastPage} onClick={handleNext}>
                        Next <FaArrowRight className="ms-2" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Result;
