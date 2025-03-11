// index.js
import { registerRootComponent } from 'expo';
import App from './App';

// Polyfill setImmediate if needed:
if (typeof setImmediate === 'undefined') {
    global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// Register your main component
registerRootComponent(App);
