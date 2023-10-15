import React, { useState } from 'react';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import FrontPage from './screens/FrontPage';
import CardScreen from './screens/CardScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import AccountPage from './screens/AccountPage';
import RegisterCard from './screens/RegisterCard';
import DebitModify from './screens/DebitModify';
import CreditModify from './screens/CreditModify';

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
          onRegister={() => handleNavigation('registerCard')}
          onDebitModify={() => handleNavigation('debitmodify')}
          onCreditModify={() => handleNavigation('creditmodify')}
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
      {isLoggedIn && currentPage === 'registerCard' && (
        <RegisterCard
          onBack={() => handleNavigation('cardscreen')}
        />
      )}
      {isLoggedIn && currentPage === 'debitmodify' && (
        <DebitModify
          onBack={() => handleNavigation('cardscreen')}
        />
      )}
      {isLoggedIn && currentPage === 'creditmodify' && (
        <CreditModify
          onBack={() => handleNavigation('cardscreen')}
        />
      )}
    </div>
  );
}

export default App;
