import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Products from './components/Products';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Quiz from './components/Quiz';
import Result from './components/Result';
import { AuthProvider } from './context/AuthContext';
import GuestRoute from './components/GuestRoute';
import AuthRoute from './components/AuthRoute';
import CheckResult from './components/CheckResult';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    return (
        <>
            <Header />
            <main className="container my-5">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/result" element={
                        <AuthRoute>
                        <>
                            <Result />
                            <CheckResult />
                        </>
                        </AuthRoute>
                    }
                    />
                    <Route path="/quiz" element={<AuthRoute><Quiz /></AuthRoute>} />
                    <Route path="/cart" element={<AuthRoute><Cart /></AuthRoute>}/>
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                </Routes>
            </main>
            <Footer />
        </>
    );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <CurrencyProvider>
                        <App />
                    </CurrencyProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
 
);

