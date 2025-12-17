import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

function AddProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        category: 'Fruits',
        stock: '',
        unit: 'kg'
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await api.post('/products', {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Product added successfully!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1 className="page-title">Add New Product</h1>
                <form className="admin-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Fresh Apples"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Price (Rs.)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="e.g. 250"
                            required
                            min="1"
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the product"
                            rows="3"
                        />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Stock Quantity</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="e.g. 100"
                                min="0"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Unit</label>
                            <select name="unit" value={formData.unit} onChange={handleChange}>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="dozen">Dozen</option>
                                <option value="piece">Piece</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={loading}
                    >
                        {loading ? 'Adding Product...' : 'Add Product'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddProduct;
