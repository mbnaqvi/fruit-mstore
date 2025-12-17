import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Cart() {
    const { cart, updateQuantity, removeItem } = useCart();

    if (cart.items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <h1 className="page-title">Shopping Cart</h1>
                    <div className="empty-state">
                        <h3>Your cart is empty</h3>
                        <p>Start shopping to add items to your cart</p>
                        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>
                <div className="cart-items">
                    {cart.items.map(item => (
                        <div key={item._id} className="cart-item">
                            <div className="cart-item-info">
                                <h4 className="cart-item-name">{item.productName}</h4>
                                <p className="cart-item-price">Rs. {item.unitPrice} each</p>
                            </div>
                            <div className="cart-item-quantity">
                                <button
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <div className="cart-item-subtotal">
                                Rs. {item.subtotal}
                            </div>
                            <button
                                className="remove-btn"
                                onClick={() => removeItem(item._id)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <div className="cart-total">
                        <span>Total Amount</span>
                        <span>Rs. {cart.totalAmount}</span>
                    </div>
                    <Link to="/checkout" className="btn btn-primary" style={{ width: '100%' }}>
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;
