import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        const success = await addToCart(productId, 1);
        if (success) {
            toast.success('Added to cart!');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="hero">
                <div className="container">
                    <h1>Fresh Fruits, Delivered Fresh!</h1>
                    <p>Browse our selection of premium quality fruits from local farms. Order now for same-day delivery or pickup from store.</p>
                </div>
            </div>
            <div className="container">
                {products.length === 0 ? (
                    <div className="empty-state">
                        <h3>No products available</h3>
                        <p>Check back soon for fresh arrivals!</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map(product => (
                            <div key={product._id} className="product-card">
                                <img
                                    src={product.image || 'https://via.placeholder.com/400x200?text=Fruit'}
                                    alt={product.name}
                                    className="product-image"
                                />
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-description">{product.description}</p>
                                    <p className="product-price">
                                        Rs. {product.price} <span className="product-unit">/ {product.unit}</span>
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAddToCart(product._id)}
                                        style={{ width: '100%' }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;
