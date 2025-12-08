from flask import Flask
from flasgger import Swagger
from config import config
from app.extensions import db, migrate, cors

def create_app(config_name='default'):
    """Application factory"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app)
    
    # Initialize Swagger
    Swagger(app, config=app.config['SWAGGER'])
    
    # Register blueprints
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app
