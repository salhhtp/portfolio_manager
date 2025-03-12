# Investment Portfolio Recommendation App

A fully functional, production-ready mobile application that provides personalized investment portfolio recommendations based on real-time financial data, user-defined parameters, and advanced optimization techniques. This app includes secure user authentication, real-time data fetching, portfolio history tracking, and projected profit calculations—all built using the latest React Native and Expo technologies.

***

## Table of Contents

*   [Overview](#overview)
*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Architecture & Workflow](#architecture--workflow)
*   [Sample Code](#sample-code)
*   [Installation & Running the App](#installation--running-the-app)
*   [API & Backend](#api--backend)
*   [Demo & QR Code](#demo--qr-code)
*   [Deployment](#deployment)
*   [Future Enhancements](#future-enhancements)
*   [License](#license)

***

## Overview

The Investment Portfolio Recommendation App is designed to help users build a diversified portfolio that maximizes their expected return for a given level of risk. By leveraging real-time market data and employing mean-variance optimization via PyPortfolioOpt, the app provides dynamic recommendations along with a projected profit calculation based on the user’s budget. Secure user authentication (JWT-based) ensures that each user’s portfolio history is tracked and can be reviewed later.

***

## Features

*   **Personalized Portfolio Recommendations**\
    Uses real-time price data from yfinance and optimizes the portfolio using mean-variance (max Sharpe ratio) optimization.

*   **Projected Profit Calculation**\
    Based on the user’s budget and the selected period, the app calculates an estimated profit (assuming a dummy annual return of 10%).

*   **User Authentication**\
    Secure registration and login using JWT tokens, ensuring that recommendations and history are personalized.

*   **Portfolio History Tracking**\
    Historical portfolio recommendations are stored and can be viewed in a dedicated History screen.

*   **Responsive, Modern UI**\
    Built with React Native Paper, React Native Chart Kit, and Expo, the app features a dark-themed, polished interface with a drop‑down menu for period selection and numeric input for budget.

*   **Real-Time Data Integration**\
    Downloads historical market data using yfinance and integrates it into the optimization logic.

***

## Tech Stack

*   **Frontend:**
    *   **React Native & Expo:** For cross‑platform mobile development
    *   **React Native Paper:** UI components and theming
    *   **React Navigation:** For multi‑screen navigation
    *   **React Native Chart Kit:** For data visualization (portfolio allocation chart)
    *   **@react-native-picker/picker:** For drop‑down selection

*   **Backend:**
    *   **Flask:** RESTful API server
    *   **SQLite:** For lightweight, local data storage
    *   **PyPortfolioOpt:** For portfolio optimization
    *   **yfinance:** For fetching real-time financial data
    *   **JWT & Werkzeug:** For user authentication and password hashing
    *   **Flask-CORS:** For cross-origin resource sharing

*   **Deployment:**
    *   **Expo CLI & EAS:** For building and deploying the mobile app
    *   **Heroku / ngrok / AWS:** (for the Flask backend)

***

## Architecture & Workflow

1.  **User Authentication:**
    *   Users register or login via the mobile app.
    *   On login, a JWT token is generated and stored securely (via AsyncStorage).

2.  **Portfolio Recommendation:**
    *   Users input a comma‑separated list of ticker symbols, select a period from a drop‑down menu, and enter a budget.
    *   The app sends this data to the Flask backend.
    *   The backend downloads historical price data using yfinance, performs mean‑variance optimization using PyPortfolioOpt, and returns a recommendation (ticker weights).
    *   The backend also calculates a projected profit based on the user’s budget and selected period (assuming a dummy 10% annual return).

3.  **Portfolio History:**
    *   Each recommendation is saved in the backend (along with the input tickers, period, and recommendation) so users can review their past portfolio suggestions.

4.  **User Interface:**
    *   A polished UI built with React Native Paper shows input fields, drop‑down menus, charts (using React Native Chart Kit), and history screens.
    *   Navigation is handled with React Navigation (native stack).

***

## Sample Code

### Backend – Portfolio Optimization & Projected Profit Calculation

```python
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

def dummy_portfolio_recommendation(tickers, period):
    # This will be replaced by the optimization function.
    return mean_variance_optimization(tickers, period)
```

**Explore the Code:** [GitHub Repository Link](https://github.com/salhhtp/portfolio_manager)
