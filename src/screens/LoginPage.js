import React from 'react';

function LoginPage({ onRegister , onLogin}) {
  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form>
        <div>
          <label htmlFor="email">Correo:</label>
          <input type="email" id="email" name="email" />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" />
        </div>
        <button type="submit" onClick={() => onLogin()}>Iniciar Sesión</button>
      </form>
      <div>
          <label>Si no cuentas con un usuario:</label>
          <button onClick={() => onRegister()}>Registrate</button>
      </div>
    </div>
  );
}

export default LoginPage;