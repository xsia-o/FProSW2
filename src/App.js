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
import NavBar from './screens/NavBar';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  const handleNavigation = (page) => {
    setCurrentPage(page);
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
      {isLoggedIn && currentPage === 'frontpage' && (
        <div>
          <NavBar
           onMain={()=> handleNavigation('frontpage')}
           onCards={() => handleNavigation('cardscreen')}
           onExpenses= {() => handleNavigation('expensesscreen')}
           onAccount={() => handleNavigation('accountpage')}
           onLogoff={() => { 
            setIsLoggedIn(false);
            handleNavigation('login');
          }} 
          />
          <FrontPage
          />
        </div>
      )}
      
      {isLoggedIn && currentPage === 'cardscreen' && (
      <div>
        <NavBar
           onMain={()=> handleNavigation('frontpage')}
         onCards={() => handleNavigation('cardscreen')}
         onExpenses= {() => handleNavigation('expensesscreen')}
         onAccount={() => handleNavigation('accountpage')}
         onLogoff={() => { 
          setIsLoggedIn(false);
          handleNavigation('login');
        }} 
        />
        <CardScreen
          onBack={() => handleNavigation('frontpage')}
          onRegister={() => handleNavigation('registerCard')}
          onDebitModify={() => handleNavigation('debitmodify')}
          onCreditModify={() => handleNavigation('creditmodify')}
        />
      </div>
        
      )}
      {isLoggedIn && currentPage === 'expensesscreen' && (
        <div>
        <NavBar
           onMain={()=> handleNavigation('frontpage')}
         onCards={() => handleNavigation('cardscreen')}
         onExpenses= {() => handleNavigation('expensesscreen')}
         onAccount={() => handleNavigation('accountpage')}
         onLogoff={() => { 
          setIsLoggedIn(false);
          handleNavigation('login');
        }} 
        />
        <ExpensesScreen
          onBack={() => handleNavigation('frontpage')}
        />
      </div>
        
      )}
      {isLoggedIn && currentPage === 'accountpage' && (
        <div>
        <NavBar
           onMain={()=> handleNavigation('frontpage')}
         onCards={() => handleNavigation('cardscreen')}
         onExpenses= {() => handleNavigation('expensesscreen')}
         onAccount={() => handleNavigation('accountpage')}
         onLogoff={() => { 
          setIsLoggedIn(false);
          handleNavigation('login');
        }} 
        />
        <AccountPage
          onBack={() => handleNavigation('frontpage')}
        />
      </div>
        
      )}
      {isLoggedIn && currentPage === 'registerCard' && (
        <div>
        <NavBar
           onMain={()=> handleNavigation('frontpage')}
         onCards={() => handleNavigation('cardscreen')}
         onExpenses= {() => handleNavigation('expensesscreen')}
         onAccount={() => handleNavigation('accountpage')}
         onLogoff={() => { 
          setIsLoggedIn(false);
          handleNavigation('login');
        }} 
        />
        <RegisterCard
          onBack={() => handleNavigation('cardscreen')}
        />
      </div>
        
      )}
      {isLoggedIn && currentPage === 'debitmodify' && (
        <div>
        <NavBar
           onMain={()=> handleNavigation('frontpage')}
         onCards={() => handleNavigation('cardscreen')}
         onExpenses= {() => handleNavigation('expensesscreen')}
         onAccount={() => handleNavigation('accountpage')}
         onLogoff={() => { 
          setIsLoggedIn(false);
          handleNavigation('login');
        }} 
        />
        <DebitModify
          onBack={() => handleNavigation('cardscreen')}
        />
      </div>
        
      )}
      {isLoggedIn && currentPage === 'creditmodify' && (
        <div>
        <NavBar
           onMain={()=> handleNavigation('frontpage')}
         onCards={() => handleNavigation('cardscreen')}
         onExpenses= {() => handleNavigation('expensesscreen')}
         onAccount={() => handleNavigation('accountpage')}
         onLogoff={() => { 
          setIsLoggedIn(false);
          handleNavigation('login');
        }} 
        />
        <CreditModify
          onBack={() => handleNavigation('cardscreen')}
        />
      </div>
        
      )}
    </div>
  );
}

export default App;
