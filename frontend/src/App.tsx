import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Lokvani...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Lokvani</h1>
        <p>Your Voice, Your Platform</p>
      </header>
      
      <main className="App-main">
        {showLogin ? (
          <Login onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
          <Register onSwitchToLogin={() => setShowLogin(true)} />
        )}
      </main>
      
      <footer className="App-footer">
        <p>&copy; 2024 Lokvani. Built with React + TypeScript + Node.js</p>
      </footer>
    </div>
  );
}

export default App;
