import secrets
from datetime import datetime, timedelta
from flask import render_template, redirect, request, url_for, session, flash, jsonify, abort, g
from . import db
from .models import User, Post
from flask import current_app as app
from werkzeug.security import generate_password_hash, check_password_hash

app.permanent_session_lifetime = timedelta(hours=1)


@app.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    token = secrets.token_hex(16)
    session['csrf_token'] = token
    return jsonify({'csrf_token': token})


@app.before_request
def load_logged_in_user():
    username = session.get('username')
    if username is None:
        g.user = None
    else:
        g.user = User.query.filter_by(username=username).first()


@app.route('/current_user', methods=['GET'])
def current_user():
    username = session.get('username')
    if username:
        return jsonify({"user": username}), 200
    else:
        return jsonify({"user": None}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        session['username'] = user.username
        session['role'] = user.role
        session.permanent = True

        return jsonify({"message": "Logged in successfully", "user": user.username, "role": user.role}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/')
def home():
    user = session.get('username', 'Guest')
    role = session.get('role', 'None')
    return render_template('index.html', user=user, role=role)


@app.route('/admin')
def admin():
    if session.get("role") != "admin":
        return render_template('403.html'), 403
    return render_template('admin.html')


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request data"}), 400

    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role', 'user')

    if not email or not username or not password:
        return jsonify({"error": "Email, username, and password are required"}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists"}), 400

    hashed_password = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
    new_user = User(username=username, password=hashed_password, role=role, email=email)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Registration successful"}), 201


@app.route('/view_users')
def view_users():
    if session.get('role') != 'admin':
        return render_template('403.html'), 403
    user = session.get('username', 'Guest')
    users = User.query.all()
    return render_template('view_users.html', user=user, users=users)


@app.route('/api/users')
def api_users():
    if session.get('role') != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    users = User.query.all()
    users_data = [
        {"username": user.username, "role": user.role, "email": user.email}
        for user in users
    ]
    return jsonify({"users": users_data})


@app.route('/update_profile/<int:user_id>', methods=['PUT'])
def update_profile(user_id):
    if 'username' not in session:
        return jsonify({"error": "Login required"}), 401

    user_to_update = User.query.get(user_id)
    if not user_to_update:
        return jsonify({"error": "User not found"}), 404

    logged_in_user = User.query.filter_by(username=session['username']).first()

    if logged_in_user.role != 'admin' and logged_in_user.id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    new_email = data.get('email')
    if new_email:
        user_to_update.email = new_email
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200

    return jsonify({"error": "No email provided"}), 400


def get_current_user():
    username = session.get('username')
    if not username:
        abort(401, description="Login required")
    user = User.query.filter_by(username=username).first()
    if not user:
        abort(401, description="User not found")
    return user


@app.route('/api/posts', methods=['GET'])
def get_posts():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = Post.query.order_by(Post.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    posts = pagination.items

    posts_data = []
    for post in posts:
        posts_data.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "created_at": post.created_at.isoformat(),
            "author": post.author.username
        })

    return jsonify({
        "posts": posts_data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page,
        "per_page": pagination.per_page,
        "has_next": pagination.has_next,
        "has_prev": pagination.has_prev,
    })


@app.route('/posts', methods=['POST'])
def create_post():
    user = get_current_user()

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    new_post = Post(title=title, content=content, author_id=user.id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({"message": "Post created", "post_id": new_post.id}), 201


@app.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    user = get_current_user()

    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    post = Post.query.get_or_404(post_id)

    if post.author_id != user.id and user.role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)

    db.session.commit()
    return jsonify({"message": "Post updated"})


@app.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    user = get_current_user()
    post = Post.query.get_or_404(post_id)

    if post.author_id != user.id and user.role != 'admin':
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"})
