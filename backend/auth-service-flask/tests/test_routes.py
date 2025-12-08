import pytest
import json
from app.models.user import User
from app.extensions import db

class TestAuthRoutes:
    """Test authentication routes"""
    
    def test_register_success(self, client):
        """Test successful registration"""
        response = client.post('/api/auth/register',
            data=json.dumps({
                'username': 'newuser',
                'email': 'new@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'token' in data
        assert data['username'] == 'newuser'
        assert data['email'] == 'new@example.com'
    
    def test_register_duplicate_username(self, client, app):
        """Test registration with duplicate username"""
        with app.app_context():
            user = User(username='existing', email='existing@example.com')
            user.set_password('password')
            db.session.add(user)
            db.session.commit()
        
        response = client.post('/api/auth/register',
            data=json.dumps({
                'username': 'existing',
                'email': 'new@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_login_success(self, client, app):
        """Test successful login"""
        with app.app_context():
            user = User(username='testuser', email='test@example.com')
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
        
        response = client.post('/api/auth/login',
            data=json.dumps({
                'usernameOrEmail': 'testuser',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'token' in data
        assert data['username'] == 'testuser'
    
    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        response = client.post('/api/auth/login',
            data=json.dumps({
                'usernameOrEmail': 'nonexistent',
                'password': 'wrongpassword'
            }),
            content_type='application/json'
        )
        
        assert response.status_code == 401
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_health_check(self, client):
        """Test health check endpoint"""
        response = client.get('/api/auth/health')
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data['status'] == 'OK'
