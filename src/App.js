import React, { useState } from 'react';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import FrontPage from './screens/FrontPage';
import CardScreen from './screens/CardScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import AccountPage from './screens/AccountPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      {currentPage === 'home' && (
        <HomePage
          onNavigate={() => handleNavigation('login')}
        />
      )}
      {currentPage === 'login' && (
        <LoginPage
          onRegister={() => handleNavigation('register')}
          onLogin={() => {
            setIsLoggedIn(true);
            handleNavigation('frontpage');
          }} 
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage onNavigate={() => handleNavigation('login')} />
      )}
      {isLoggedIn && currentPage === 'frontpage' && <FrontPage /> && (
        <FrontPage
        onCards={() => handleNavigation('cardscreen')}
        onExpenses= {() => handleNavigation('expensesscreen')}
        onAccount={() => handleNavigation('accountpage')}
        onLogoff={() => {
          setIsLoggedIn(false);
          handleNavigation('login');
        }} 
      />
      )}
      
      {isLoggedIn && currentPage === 'cardscreen' && (
        <CardScreen
          onBack={() => handleNavigation('frontpage')}
        />
      )}
      {isLoggedIn && currentPage === 'expensesscreen' && (
        <ExpensesScreen
          onBack={() => handleNavigation('frontpage')}
        />
      )}
      {isLoggedIn && currentPage === 'accountpage' && (
        <AccountPage
          onBack={() => handleNavigation('frontpage')}
        />
      )}
    </div>
  );
}

export default App;
