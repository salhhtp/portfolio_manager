import os
import sqlite3
import json
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
import sympy
import yfinance as yf
from pypfopt import EfficientFrontier, risk_models, expected_returns

# Configuration
DATABASE = os.path.join(os.getcwd(), 'database.db')
JWT_SECRET = 'your_jwt_secret_key'  # Replace with a strong secret in production
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600  # 1 hour

# Initialize Flask and CORS
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_flask_secret_key'  # Replace with a strong secret key
CORS(app)

# ---------------------------
# Database Helpers
# ---------------------------
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        db.execute('''
            CREATE TABLE IF NOT EXISTS portfolio_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                tickers TEXT,
                period TEXT,
                recommendation TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        db.commit()

# ---------------------------
# JWT Helpers and Decorator
# ---------------------------
def create_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload['user_id']
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 403
        user_id = decode_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid or expired token!'}), 403
        return f(user_id, *args, **kwargs)
    return decorated

# ---------------------------
# Authentication Endpoints
# ---------------------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    if user:
        return jsonify({'error': 'Username already exists'}), 400
    hashed = generate_password_hash(password)
    db.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed))
    db.commit()
    return jsonify({'status': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
    if user and check_password_hash(user['password'], password):
        token = create_token(user['id'])
        return jsonify({'token': token})
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# ---------------------------
# Portfolio Recommendation Logic
# ---------------------------
def fetch_price_data(tickers, period='1y'):
    data = yf.download(tickers, period=period)
    if 'Adj Close' in data:
        return data['Adj Close']
    else:
        return data['Close']

def mean_variance_optimization(tickers, period='1y'):
    prices = fetch_price_data(tickers, period=period)
    prices = prices.dropna(axis=1, how='all')
    if len(prices.shape) == 1:
        prices = prices.to_frame()
    mu = expected_returns.mean_historical_return(prices)
    S = risk_models.sample_cov(prices)
    ef = EfficientFrontier(mu, S)
    weights = ef.max_sharpe()
    cleaned_weights = ef.clean_weights()
    return {ticker: round(weight, 4) for ticker, weight in cleaned_weights.items() if weight > 0}

@app.route('/api/portfolio', methods=['POST'])
@token_required
def portfolio(user_id):
    data = request.get_json()
    tickers = data.get('tickers')  # Expected to be a list
    period = data.get('period', '1y')
    budget = data.get('budget', 0)
    if not tickers or not isinstance(tickers, list):
        return jsonify({'error': 'Tickers (as a list) are required'}), 400
    try:
        recommendation = mean_variance_optimization(tickers, period)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Calculate projected profit based on the user's budget.
    try:
        years = float(period.strip('y'))
    except Exception:
        years = 1
    expected_return = 0.10  # Assume a 10% annual return (dummy value)
    try:
        budget_value = float(budget)
    except Exception:
        budget_value = 0
    projected_profit = budget_value * ((1 + expected_return) ** years - 1) if budget_value > 0 else 0

    db = get_db()
    db.execute('''
        INSERT INTO portfolio_history (user_id, tickers, period, recommendation)
        VALUES (?, ?, ?, ?)
    ''', (
        user_id,
        json.dumps(tickers),
        period,
        json.dumps(recommendation)
    ))
    db.commit()

    return jsonify({
        'recommendation': recommendation,
        'projected_profit': projected_profit
    })

@app.route('/api/get_history', methods=['GET'])
@token_required
def get_history(user_id):
    db = get_db()
    rows = db.execute(
        'SELECT * FROM portfolio_history WHERE user_id = ? ORDER BY created_at DESC',
        (user_id,)
    ).fetchall()

    history = []
    for row in rows:
        try:
            tickers_list = json.loads(row['tickers']) if row['tickers'] else []
        except:
            tickers_list = [t.strip() for t in row['tickers'].split(',')] if row['tickers'] else []
        try:
            recommendation_dict = json.loads(row['recommendation']) if row['recommendation'] else {}
        except:
            recommendation_dict = {}

        history.append({
            'id': row['id'],
            'user_id': row['user_id'],
            'tickers': tickers_list,
            'period': row['period'],
            'recommendation': recommendation_dict,
            'created_at': row['created_at']
        })
    return jsonify({'history': history})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
