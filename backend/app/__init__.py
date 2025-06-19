from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'dev-secret-key'
    print("DATABASE_URL env var:", os.getenv('DATABASE_URL'))
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://admin:admin@db:5432/admin'
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config.update(
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=True,  # True if using HTTPS, False for dev HTTP
    )

    # CORS(app, supports_credentials=True, origins=["http://localhost"])
    CORS(app, supports_credentials=True, origins=["http://localhost:3000", "http://172.21.0.3:3000"])

    db.init_app(app)

    with app.app_context():
        from . import routes
        db.create_all()

    return app
