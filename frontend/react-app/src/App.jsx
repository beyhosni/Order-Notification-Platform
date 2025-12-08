import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductCatalog from './pages/ProductCatalog';
import OrderPage from './pages/OrderPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <Router>
            <div className="app">
                {isAuthenticated && <Header />}
                <Routes>
                    <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/products" />} />
                    <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/products" />} />
                    <Route path="/products" element={isAuthenticated ? <ProductCatalog /> : <Navigate to="/login" />} />
                    <Route path="/orders" element={isAuthenticated ? <OrderPage /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={isAuthenticated ? "/products" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
