import pytest
from app.models.user import User
from app.extensions import db

class TestUserModel:
    """Test User model"""
    
    def test_create_user(self, app):
        """Test creating a user"""
        with app.app_context():
            user = User(username='testuser', email='test@example.com')
            user.set_password('password123')
            
            db.session.add(user)
            db.session.commit()
            
            assert user.id is not None
            assert user.username == 'testuser'
            assert user.email == 'test@example.com'
            assert user.password_hash is not None
    
    def test_password_hashing(self, app):
        """Test password hashing and verification"""
        with app.app_context():
            user = User(username='testuser', email='test@example.com')
            user.set_password('password123')
            
            assert user.check_password('password123') is True
            assert user.check_password('wrongpassword') is False
    
    def test_user_to_dict(self, app):
        """Test user serialization"""
        with app.app_context():
            user = User(username='testuser', email='test@example.com', roles='USER,ADMIN')
            user.set_password('password123')
            db.session.add(user)
            db.session.commit()
            
            user_dict = user.to_dict()
            assert user_dict['username'] == 'testuser'
            assert user_dict['email'] == 'test@example.com'
            assert 'USER' in user_dict['roles']
            assert 'ADMIN' in user_dict['roles']
            assert 'password' not in user_dict
