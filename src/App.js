import React, { useState } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './pages/Dashboard';
import TicketManagement from './pages/TicketManagement';

function App() {
  // --- Page state: controls what screen is visible
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('isLoggedIn') === 'true' ? 'dashboard' : 'landing'
  );

  // --- Auth & navigation handlers
  const handleLogin = () => setCurrentPage('auth');
  const handleGetStarted = () => setCurrentPage('auth');
  const handleBack = () => setCurrentPage('landing');

  const handleAuthSuccess = () => {
    alert('You are logged in!');
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setCurrentPage('landing');
  };

  const handleNavigateToTickets = () => setCurrentPage('tickets');
  const handleBackToDashboard = () => setCurrentPage('dashboard');

  return (
    <Layout>
      {currentPage === 'landing' && (
        <LandingPage onLogin={handleLogin} onGetStarted={handleGetStarted} />
      )}

      {currentPage === 'auth' && (
        <AuthPage onSuccess={handleAuthSuccess} onBack={handleBack} />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard
          onLogout={handleLogout}
          onNavigateToTickets={handleNavigateToTickets}
        />
      )}

      {currentPage === 'tickets' && (
        <TicketManagement onBack={handleBackToDashboard} />
      )}
    </Layout>
  );
}

export default App;
