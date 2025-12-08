import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await orderAPI.getByUserId(user.userId);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDING: '#ff9800',
            CONFIRMED: '#2196f3',
            PAID: '#4caf50',
            SHIPPED: '#9c27b0',
            DELIVERED: '#4caf50',
            CANCELLED: '#f44336'
        };
        return colors[status] || '#999';
    };

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="container">
            <div className="card">
                <h2>My Orders ({orders.length})</h2>
                {orders.length === 0 ? (
                    <p>You haven't placed any orders yet.</p>
                ) : (
                    <div style={{ marginTop: '1.5rem' }}>
                        {orders.map(order => (
                            <div key={order.id} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '12px', border: '2px solid #e0e0e0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>Order #{order.id.substring(0, 8)}</h3>
                                        <p style={{ color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            background: getStatusColor(order.status),
                                            color: 'white',
                                            fontWeight: 'bold',
                                            display: 'inline-block'
                                        }}>
                                            {order.status}
                                        </span>
                                        <h3 style={{ marginTop: '0.5rem', color: '#667eea' }}>${order.totalAmount}</h3>
                                    </div>
                                </div>
                                <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                                    <h4 style={{ marginBottom: '0.5rem' }}>Items:</h4>
                                    {order.items.map((item, index) => (
                                        <div key={index} style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{item.productName} × {item.quantity}</span>
                                            <span style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderPage;
