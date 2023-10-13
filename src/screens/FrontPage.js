import React from 'react';
import NavBar from './NavBar'; 

function FrontPage({ onCards, onExpenses, onAccount, onLogoff }) {
  
  return (
    <div>
      <NavBar />
      <h2>Bienvenido a la página principal</h2>
      <ul>
        <li>
          <button onClick={() => onCards()}>Visualizar Tarjetas</button>
        </li>
        <li>
          <button onClick={() => onExpenses()}>Visualizar Gastos</button>
        </li>
        <li>
          <button onClick={() => onAccount()}>Configuración de Cuenta</button>
        </li>
        <li>
          <button onClick={() => onLogoff()}>Cerrar Sesión</button>
        </li>
      </ul>
    </div>
  );
}

export default FrontPage;
