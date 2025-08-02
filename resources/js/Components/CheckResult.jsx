import { Navigate } from 'react-router-dom';

const CheckResult = ({ children }) => {
    const quiz = localStorage.getItem('quiz');
    
    if (!quiz) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default CheckResult;