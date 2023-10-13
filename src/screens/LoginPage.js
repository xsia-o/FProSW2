import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

function LoginPage({ onRegister , onLogin}) {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/iniciar-sesion', formData);

      if (response.status === 200) {
        console.log('Inicio de sesión exitoso');
        onLogin();
      } else {
        console.log('Inicio de sesión falló');
      }
    } catch (error) {
      setError('Credenciales Incorrectas');
      console.error('Error al iniciar sesión', error);
    }
  };

  return (
    <div>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>

        <h2>Iniciar Sesión</h2>
        <TextField
            id="outlined-required"
            label="Correo Electronico"
            name="email"
            value={formData.email}
            onChange={handleChange}
            />
        <TextField
            id="outlined-password-input"
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            />
        {error && <div style={{ color: 'red' }}>{error}</div>}    
        <Button variant="outlined" onClick={handleLogin}>Iniciar Sesion</Button> 

      </Stack>
      <br/>
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <label>Si no cuentas con un usuario:</label>
          <Button variant="contained" onClick={() => onRegister()}>Registrate</Button>
      </Stack>
    </div>
  );
}

export default LoginPage;