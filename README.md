Investment Portfolio Recommendation App
A fully functional, production-ready mobile application that provides personalized investment portfolio recommendations based on real-time financial data, user-defined parameters, and advanced optimization techniques. This app includes secure user authentication, real-time data fetching, portfolio history tracking, and projected profit calculations—all built using the latest React Native and Expo technologies.

Table of Contents
Overview
Features
Tech Stack
Architecture & Workflow
Sample Code
Installation & Running the App
API & Backend
Demo & QR Code
Deployment
Future Enhancements
License
Overview
The Investment Portfolio Recommendation App is designed to help users build a diversified portfolio that maximizes their expected return for a given level of risk. By leveraging real-time market data and employing mean-variance optimization via PyPortfolioOpt, the app provides dynamic recommendations along with a projected profit calculation based on the user’s budget. Secure user authentication (JWT-based) ensures that each user’s portfolio history is tracked and can be reviewed later.

Features
Personalized Portfolio Recommendations\ Uses real-time price data from yfinance and optimizes the portfolio using mean-variance (max Sharpe ratio) optimization.

Projected Profit Calculation\ Based on the user’s budget and the selected period, the app calculates an estimated profit (assuming a dummy annual return of 10%).

User Authentication\ Secure registration and login using JWT tokens, ensuring that recommendations and history are personalized.

Portfolio History Tracking\ Historical portfolio recommendations are stored and can be viewed in a dedicated History screen.

Responsive, Modern UI\ Built with React Native Paper, React Native Chart Kit, and Expo, the app features a dark-themed, polished interface with a drop‑down menu for period selection and numeric input for budget.

Real-Time Data Integration\ Downloads historical market data using yfinance and integrates it into the optimization logic.

Tech Stack
Frontend:

React Native & Expo: For cross‑platform mobile development
React Native Paper: UI components and theming
React Navigation: For multi‑screen navigation
React Native Chart Kit: For data visualization (portfolio allocation chart)
@react-native-picker/picker: For drop‑down selection
Backend:

Flask: RESTful API server
SQLite: For lightweight, local data storage
PyPortfolioOpt: For portfolio optimization
yfinance: For fetching real-time financial data
JWT & Werkzeug: For user authentication and password hashing
Flask-CORS: For cross-origin resource sharing
Deployment:

Expo CLI & EAS: For building and deploying the mobile app
Heroku / ngrok / AWS: (for the Flask backend)
Architecture & Workflow
User Authentication:

Users register or login via the mobile app.
On login, a JWT token is generated and stored securely (via AsyncStorage).
Portfolio Recommendation:

Users input a comma‑separated list of ticker symbols, select a period from a drop‑down menu, and enter a budget.
The app sends this data to the Flask backend.
The backend downloads historical price data using yfinance, performs mean‑variance optimization using PyPortfolioOpt, and returns a recommendation (ticker weights).
The backend also calculates a projected profit based on the user’s budget and selected period (assuming a dummy 10% annual return).
Portfolio History:

Each recommendation is saved in the backend (along with the input tickers, period, and recommendation) so users can review their past portfolio suggestions.
User Interface:

A polished UI built with React Native Paper shows input fields, drop‑down menus, charts (using React Native Chart Kit), and history screens.
Navigation is handled with React Navigation (native stack).
