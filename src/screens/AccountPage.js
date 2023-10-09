import React, { useState } from 'react';

function AccountPage({ onBack }) {
  const [email, setEmail] = useState('usuario@example.com');
  const [username, setUsername] = useState('miusuario');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes implementar la lógica para actualizar la configuración del usuario
    alert('Configuración de usuario actualizada');
  };

  return (
    <div>
      <h2>Configuración de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Correo:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Guardar Cambios</button>
      </form>
      <button onClick={onBack}>Atrás</button>
    </div>
  );
}

export default AccountPage;
