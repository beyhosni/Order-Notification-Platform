import { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../services/api';

function ProductCatalog() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productAPI.getAll();
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.productId === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                productId: product.id,
                productName: product.name,
                quantity: 1,
                price: product.price
            }]);
        }
        setMessage(`✅ ${product.name} added to cart!`);
        setTimeout(() => setMessage(''), 2000);
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity === 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item.productId === productId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const placeOrder = async () => {
        if (cart.length === 0) {
            setMessage('❌ Cart is empty!');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await orderAPI.create({
                userId: user.userId,
                items: cart
            });
            setMessage('✅ Order placed successfully!');
            setCart([]);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Failed to place order: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div className="container">
            {message && <div className={message.includes('✅') ? 'success' : 'error'}>{message}</div>}

            <div className="card">
                <h2>Shopping Cart ({cart.length} items)</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <>
                        {cart.map(item => (
                            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                                <div>
                                    <strong>{item.productName}</strong>
                                    <p style={{ color: '#667eea', fontWeight: 'bold' }}>${item.price} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem' }}>-</button>
                                    <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem' }}>+</button>
                                    <button onClick={() => removeFromCart(item.productId)} className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', background: '#fee', color: '#c33' }}>Remove</button>
                                </div>
                            </div>
                        ))}
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                            <h3>Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</h3>
                            <button onClick={placeOrder} className="btn btn-primary" style={{ marginTop: '1rem' }}>Place Order</button>
                        </div>
                    </>
                )}
            </div>

            <div className="card">
                <h2>Available Products</h2>
                <div className="grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <h3>{product.name}</h3>
                            <p style={{ color: '#666', marginBottom: '1rem' }}>{product.description}</p>
                            <div className="price">${product.price}</div>
                            <button onClick={() => addToCart(product)} className="btn btn-primary" style={{ width: '100%' }}>
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ProductCatalog;
