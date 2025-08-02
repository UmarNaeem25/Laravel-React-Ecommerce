import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../axios';
import { useAuth } from './AuthContext'; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth(); 
    const [cartCount, setCartCount] = useState(0);

    const fetchCartCount = async () => {
        try {
            if (user && user.id) {
                const res = await axios.get(`/api/cart-count?user_id=${user.id}`);
                setCartCount(res.data.count);
            }
        } catch (err) {
            console.error('Error fetching cart count:', err);
        }
    };

    useEffect(() => {
        fetchCartCount(); 
    }, [user]); 

    return (
        <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
