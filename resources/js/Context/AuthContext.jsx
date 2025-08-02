import { createContext, useContext, useEffect, useState } from 'react';
import axios from '../axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false); 
                    return;
                }

                const res = await axios.get('/api/protected-test', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
  
                setUser(res.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false); 
            }
        };

        fetchUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setUser(null); 
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
