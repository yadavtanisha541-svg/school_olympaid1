import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { App } from './App';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', fontFamily: 'sans-serif', background: '#0b0f19', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ maxWidth: '600px', background: '#131b2e', padding: '30px', borderRadius: '16px', border: '1px solid #222f48', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}>
            <h2 style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Something went wrong</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>{this.state.error?.toString()}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                style={{ padding: '10px 18px', background: '#80497D', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Clear Cache &amp; Reload
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '10px 18px', background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
