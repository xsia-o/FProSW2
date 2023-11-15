import React, { useState } from 'react';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import FrontPage from './screens/FrontPage';
import CardScreen from './screens/CardScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import AccountPage from './screens/AccountPage';
import RegisterCard from './screens/RegisterCard';
import DebitModify from './screens/DebitModify';
import CreditModify from './screens/CreditModify';
import RegisterIncome from './screens/RegisterIncome';
import RegisterExpense from './screens/RegisterExpense';
import NavBar from './screens/NavBar';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const NavBarProps = {
    onMain: () => handleNavigation('frontpage'),
    onCards: () => handleNavigation('cardscreen'),
    onExpenses: () => handleNavigation('expensesscreen'),
    onAccount: () => handleNavigation('accountpage'),
    onLogoff: () => {
      setIsLoggedIn(false);
      handleNavigation('login');
    },
  };

  return (
    <div className="App">
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
      {isLoggedIn && (
        <div>
          <NavBar {...NavBarProps} />
          {currentPage === 'frontpage' && <FrontPage />}
          {currentPage === 'cardscreen' && (
            <CardScreen
              onBack={() => handleNavigation('frontpage')}
              onRegister={() => handleNavigation('registerCard')}
              onIncome={() => handleNavigation('registerincome')}
              onDebitModify={() => handleNavigation('debitmodify')}
              onCreditModify={() => handleNavigation('creditmodify')}
            />
          )}
          {currentPage === 'expensesscreen' && (
            <ExpensesScreen
              onBack={() => handleNavigation('frontpage')}
              onRegister={() => handleNavigation('registerexpense')} />
          )}
          {currentPage === 'registerexpense' && (
            <RegisterExpense
              onBack={() => handleNavigation('expensesscreen')} />
          )}
          {currentPage === 'accountpage' && (
            <AccountPage
              onBack={() => handleNavigation('frontpage')}
              onLogoff={() => {
                setIsLoggedIn(false);
                handleNavigation('login');
              }} />
          )}
          {currentPage === 'registerCard' && (
            <RegisterCard onBack={() => handleNavigation('cardscreen')} />
          )}
          {currentPage === 'debitmodify' && (
            <DebitModify onBack={() => handleNavigation('cardscreen')} />
          )}
          {currentPage === 'creditmodify' && (
            <CreditModify onBack={() => handleNavigation('cardscreen')} />
          )}
          {currentPage === 'registerincome' && (
            <RegisterIncome onBack={() => handleNavigation('cardscreen')} />
          )

          }
        </div>
      )}
    </div>
  );
}

export default App;
