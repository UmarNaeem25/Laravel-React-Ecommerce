import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../axios';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('$');
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedCurrency = localStorage.getItem('currency');
        if (savedCurrency) {
            setCurrency(savedCurrency);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const res = await axios.get('/api/currencies');
                setCurrencies(res.data.currencies);
            } catch (error) {
                console.error('Failed to fetch currencies', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrencies();
    }, []);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, currencies, loading }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => useContext(CurrencyContext);
