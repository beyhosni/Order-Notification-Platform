from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from flasgger import swag_from
from app.extensions import db
from app.models.user import User
from app.schemas.auth_schemas import RegisterSchema, LoginSchema, AuthResponseSchema
from app.utils.jwt_utils import generate_token

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

register_schema = RegisterSchema()
login_schema = LoginSchema()
auth_response_schema = AuthResponseSchema()

@auth_bp.route('/register', methods=['POST'])
@swag_from({
    'tags': ['Authentication'],
    'description': 'Register a new user',
    'parameters': [{
        'name': 'body',
        'in': 'body',
        'required': True,
        'schema': {
            'type': 'object',
            'properties': {
                'username': {'type': 'string', 'example': 'johndoe'},
                'email': {'type': 'string', 'example': 'john@example.com'},
                'password': {'type': 'string', 'example': 'password123'}
            }
        }
    }],
    'responses': {
        '200': {
            'description': 'User registered successfully',
            'schema': {
                'type': 'object',
                'properties': {
                    'token': {'type': 'string'},
                    'userId': {'type': 'string'},
                    'username': {'type': 'string'},
                    'email': {'type': 'string'},
                    'roles': {'type': 'array', 'items': {'type': 'string'}}
                }
            }
        },
        '400': {'description': 'Validation error or user already exists'}
    }
})
def register():
    """Register a new user"""
    try:
        # Validate request data
        data = register_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'error': err.messages}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        roles='USER'
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Generate token
    token = generate_token(user)
    
    response = {
        'token': token,
        'userId': user.id,
        'username': user.username,
        'email': user.email,
        'roles': user.roles.split(',') if user.roles else []
    }
    
    return jsonify(response), 200

@auth_bp.route('/login', methods=['POST'])
@swag_from({
    'tags': ['Authentication'],
    'description': 'Login with username/email and password',
    'parameters': [{
        'name': 'body',
        'in': 'body',
        'required': True,
        'schema': {
            'type': 'object',
            'properties': {
                'usernameOrEmail': {'type': 'string', 'example': 'johndoe'},
                'password': {'type': 'string', 'example': 'password123'}
            }
        }
    }],
    'responses': {
        '200': {
            'description': 'Login successful',
            'schema': {
                'type': 'object',
                'properties': {
                    'token': {'type': 'string'},
                    'userId': {'type': 'string'},
                    'username': {'type': 'string'},
                    'email': {'type': 'string'},
                    'roles': {'type': 'array', 'items': {'type': 'string'}}
                }
            }
        },
        '400': {'description': 'Validation error'},
        '401': {'description': 'Invalid credentials'}
    }
})
def login():
    """Login user"""
    try:
        data = login_schema.load(request.json)
    except ValidationError as err:
        return jsonify({'error': err.messages}), 400
    
    # Find user by username or email
    user = User.query.filter(
        (User.username == data['usernameOrEmail']) | 
        (User.email == data['usernameOrEmail'])
    ).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Generate token
    token = generate_token(user)
    
    response = {
        'token': token,
        'userId': user.id,
        'username': user.username,
        'email': user.email,
        'roles': user.roles.split(',') if user.roles else []
    }
    
    return jsonify(response), 200

@auth_bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'OK', 'service': 'auth-service-flask'}), 200
