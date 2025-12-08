import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="header">
            <h1>🛒 Order Platform</h1>
            <nav className="nav">
                <Link to="/products">Products</Link>
                <Link to="/orders">My Orders</Link>
                <span style={{ color: '#667eea', fontWeight: 600 }}>
                    👤 {user.username || 'User'}
                </span>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                    Logout
                </button>
            </nav>
        </header>
    );
}

export default Header;
