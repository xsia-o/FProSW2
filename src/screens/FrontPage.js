import React from 'react';
import NavBar from './NavBar'; 
import Button from '@mui/material/Button';
import '../App.css'

function FrontPage({ onCards, onExpenses, onAccount, onLogoff}) {
  
  return (
    <div>
      <NavBar />
      <div className='whiteBox'>
        <h2>Bienvenido a la página principal</h2>
        <ul>
          <li>
            <Button variant="outlined" onClick={() => onCards()}>Visualizar Tarjetas</Button>
          </li>
          <li>
            <Button disabled variant="outlined" onClick={() => onExpenses()}>Visualizar Gastos</Button>
          </li>
          <li>
            <Button disabled variant="outlined" onClick={() => onAccount()}>Configuración de Cuenta</Button>
          </li>
          <li>
            <Button variant="outlined" onClick={() => onLogoff()}>Cerrar Sesión</Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FrontPage;
