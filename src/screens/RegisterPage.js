import React from 'react';

function RegisterPage({ onNavigate }) {
  return (
    <div>
      <h2>Registrarse</h2>
      <form>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email">Correo:</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit" onClick={() => onNavigate()}>Registrarse</button>
      </form>
      <button onClick={() => onNavigate()}>Volver a la página principal</button>
    </div>
  );
}

export default RegisterPage;
    