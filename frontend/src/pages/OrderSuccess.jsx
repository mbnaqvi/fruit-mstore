import { Link, useLocation } from 'react-router-dom';

function OrderSuccess() {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return (
            <div className="success-page">
                <div className="container">
                    <div className="success-icon">✓</div>
                    <h1 className="success-title">Order Placed!</h1>
                    <p className="success-message">Your order has been successfully placed.</p>
                    <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="success-page">
            <div className="container">
                <div className="success-icon">✓</div>
                <h1 className="success-title">Order Confirmed!</h1>
                <p className="success-message">Thank you for your order. We'll contact you shortly.</p>

                <div className="order-details">
                    <h3>Order Details</h3>
                    <div className="order-detail-row">
                        <span>Order ID</span>
                        <span>{order.orderId}</span>
                    </div>
                    <div className="order-detail-row">
                        <span>Customer Name</span>
                        <span>{order.customerName}</span>
                    </div>
                    <div className="order-detail-row">
                        <span>Items</span>
                        <span>{order.items.length} item(s)</span>
                    </div>
                    <div className="order-detail-row">
                        <span>Total Amount</span>
                        <span style={{ color: '#2d6a4f', fontWeight: '700' }}>Rs. {order.totalAmount}</span>
                    </div>
                    <div className="order-detail-row">
                        <span>Delivery Option</span>
                        <span>{order.deliveryOption === 'delivery' ? ' Home Delivery' : ' Pickup'}</span>
                    </div>
                    {order.deliveryOption === 'delivery' && (
                        <div className="order-detail-row">
                            <span>Address</span>
                            <span>{order.deliveryAddress}</span>
                        </div>
                    )}
                    <div className="order-detail-row">
                        <span>Payment Method</span>
                        <span>{order.paymentMethod === 'COD' ? ' Cash on Delivery' : ' Card Payment'}</span>
                    </div>
                    <div className="order-detail-row">
                        <span>Status</span>
                        <span className="badge badge-success">{order.status}</span>
                    </div>
                </div>

                <Link to="/" className="btn btn-primary">Continue Shopping</Link>
            </div>
        </div>
    );
}

export default OrderSuccess;
