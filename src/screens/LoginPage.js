import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import Cookies from 'js-cookie';

function LoginPage({ onRegister , onLogin}) {
  //Logica para Iniciar Sesion
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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
        Cookies.set('userId', response.data.userId.toString());
        onLogin();
      } else {
        console.log('Inicio de sesión falló');
      }
    } catch (error) {
      setError('Credenciales Incorrectas');
      console.error('Error al iniciar sesión', error);
    }
  };
  //Logica para correcto formato
  const [emailError, setEmailError] = useState('');
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    setEmailError(email.trim() !== '' && !isValidEmail(email) ? 'Correo electrónico inválido' : '');
  };
  
  //Logica para Mostrar/Ocultar contraseña
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <h2>Iniciar Sesión</h2>
        <TextField
            label="Correo Electronico"
            name="email"
            value={formData.email}
            onChange={handleEmailChange}
            error={emailError !== ''}
            helperText={emailError}
            />
        <TextField
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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