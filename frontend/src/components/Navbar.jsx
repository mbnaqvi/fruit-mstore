import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    Fruit <span>mStore</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/">Products</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin/add-product">Add Product</Link>
                    )}
                    {user ? (
                        <>
                            <Link to="/cart" className="cart-icon">
                                🛒
                                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                            </Link>
                            <span>Hi, {user.name.split(' ')[0]}</span>
                            <button onClick={logout} className="btn btn-sm btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn btn-secondary btn-sm">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
