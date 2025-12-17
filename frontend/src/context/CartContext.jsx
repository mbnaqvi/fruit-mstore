import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart({ items: [], totalAmount: 0 });
        }
    }, [user]);

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await api.get('/cart', getAuthHeader());
            setCart(res.data);
        } catch (error) {
            console.error('Failed to fetch cart');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await api.post('/cart/add', { productId, quantity }, getAuthHeader());
            setCart(res.data.cart);
            return true;
        } catch (error) {
            console.error('Failed to add to cart');
            return false;
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const res = await api.put(`/cart/update/${itemId}`, { quantity }, getAuthHeader());
            setCart(res.data.cart);
        } catch (error) {
            console.error('Failed to update quantity');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const res = await api.delete(`/cart/remove/${itemId}`, getAuthHeader());
            setCart(res.data.cart);
        } catch (error) {
            console.error('Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/cart/clear', getAuthHeader());
            setCart({ items: [], totalAmount: 0 });
        } catch (error) {
            console.error('Failed to clear cart');
        }
    };

    const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, cartCount, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
