import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

function Checkout() {
    const { cart, fetchCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: user?.phone || '',
        deliveryOption: 'delivery',
        deliveryAddress: '',
        paymentMethod: 'COD',
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.deliveryOption === 'delivery' && !formData.deliveryAddress) {
            toast.error('Please enter your delivery address');
            return;
        }
        if (formData.paymentMethod === 'Card') {
            if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
                toast.error('Please fill in all card details');
                return;
            }
            if (formData.cardNumber.length < 16) {
                toast.error('Please enter a valid card number');
                return;
            }
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const orderData = {
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                deliveryOption: formData.deliveryOption,
                deliveryAddress: formData.deliveryAddress,
                paymentMethod: formData.paymentMethod,
                cardDetails: formData.paymentMethod === 'Card' ? {
                    cardNumber: formData.cardNumber,
                    cardHolder: formData.cardHolder,
                    expiryDate: formData.expiryDate
                } : null
            };
            const res = await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchCart();
            navigate('/order-success', { state: { order: res.data.order } });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (cart.items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="page-title">Checkout</h1>
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <div className="checkout-section">
                        <h3 className="section-title">Customer Information</h3>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="customerPhone"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="checkout-section">
                        <h3 className="section-title">Delivery Option</h3>
                        <div className="delivery-options">
                            <label className={`delivery-option ${formData.deliveryOption === 'delivery' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="deliveryOption"
                                    value="delivery"
                                    checked={formData.deliveryOption === 'delivery'}
                                    onChange={handleChange}
                                />
                                <div className="delivery-option-title"> Home Delivery</div>
                                <div className="delivery-option-desc">Get it delivered to your doorstep</div>
                            </label>
                            <label className={`delivery-option ${formData.deliveryOption === 'pickup' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="deliveryOption"
                                    value="pickup"
                                    checked={formData.deliveryOption === 'pickup'}
                                    onChange={handleChange}
                                />
                                <div className="delivery-option-title"> Pickup from Store</div>
                                <div className="delivery-option-desc">Collect from our store location</div>
                            </label>
                        </div>
                        {formData.deliveryOption === 'delivery' && (
                            <div className="form-group" style={{ marginTop: '20px' }}>
                                <label>Delivery Address</label>
                                <textarea
                                    name="deliveryAddress"
                                    value={formData.deliveryAddress}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter your complete delivery address"
                                    required
                                />
                            </div>
                        )}
                        {formData.deliveryOption === 'pickup' && (
                            <div className="pickup-note">
                                 Your order will be ready for pickup at our store: Fruit mStore, Main Market, City Center. You will receive a confirmation call when ready.
                            </div>
                        )}
                    </div>

                    <div className="checkout-section">
                        <h3 className="section-title">Payment Method</h3>
                        <div className="payment-options">
                            <label className={`payment-option ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === 'COD'}
                                    onChange={handleChange}
                                />
                                <div className="delivery-option-title"> Cash on Delivery</div>
                                <div className="delivery-option-desc">Pay when you receive</div>
                            </label>
                            <label className={`payment-option ${formData.paymentMethod === 'Card' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Card"
                                    checked={formData.paymentMethod === 'Card'}
                                    onChange={handleChange}
                                />
                                <div className="delivery-option-title"> Card Payment</div>
                                <div className="delivery-option-desc">Pay with credit/debit card</div>
                            </label>
                        </div>
                        {formData.paymentMethod === 'Card' && (
                            <div className="card-form">
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="16"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Card Holder Name</label>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={formData.cardHolder}
                                        onChange={handleChange}
                                        placeholder="Name on card"
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleChange}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleChange}
                                            placeholder="123"
                                            maxLength="3"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="checkout-section">
                        <h3 className="section-title">Order Summary</h3>
                        <div className="order-summary">
                            {cart.items.map(item => (
                                <div key={item._id} className="order-item">
                                    <span>{item.productName} × {item.quantity}</span>
                                    <span>Rs. {item.subtotal}</span>
                                </div>
                            ))}
                            <div className="order-total">
                                <span>Total</span>
                                <span>Rs. {cart.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '15px' }}
                        disabled={loading}
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Checkout;
