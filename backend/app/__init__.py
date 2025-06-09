from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'dev-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///owasp.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config.update(
        SESSION_COOKIE_SAMESITE="None",
        SESSION_COOKIE_SECURE=False,  # True if using HTTPS, False for dev HTTP
    )

    CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

    db.init_app(app)

    with app.app_context():
        from . import routes
        db.create_all()

    return app
