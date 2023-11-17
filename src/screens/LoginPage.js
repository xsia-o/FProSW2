import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack, TextField, Button, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import '../App.css';
import logoImage from '../resources/LogoNormal.png';

function LoginPage({ onRegister, onLogin }) {
  const [error, setError] = useState('');    //Alerta de error para el Formulario
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  }); // Data de Formulario

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }; //Encargado de manejar los cambios del formulario (En vivo y en directo)

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
  }; //Función encargada de iniciar sesion

  //Código necesario para un correcto formato
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
  //Código necesario para poder ocultar o mostrar la contraseña 
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //Propiedades comunes de la página
  const stackProps = {
    justifyContent: "center",
    alignItems: "center",
    spacing: 2,
  }
  const rowStackProps = {
    direction: "row",
    ...stackProps,
  };
  const columnStackProps = {
    direction: "column",
    ...stackProps,
  };
  const passwordProps = {
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          aria-label="Toggle Password Visibility"
          onClick={handleClickShowPassword}
          onMouseDown={handleMouseDownPassword}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  };
  return (
    <div className='LoginBox'> {/*Caja Blanca*/}
      <img src={logoImage} alt="Logo" className="logo"></img>
      <Stack {...columnStackProps}>
        <h2>Iniciar Sesión</h2>
        <TextField label="Correo Electronico" name="email" value={formData.email} onChange={handleEmailChange}
          error={emailError !== ''}
          helperText={emailError} />
        <TextField label="Contraseña" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} InputProps={passwordProps} />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button variant="outlined" onClick={handleLogin} style={{ color: 'black', borderColor: 'black' }} >Iniciar Sesion</Button>
        <Stack {...rowStackProps}>
          <label>Si no cuentas con un usuario:</label>
          <Button variant="contained" onClick={() => onRegister()} style={{ backgroundColor: 'black', color: 'white' }}>Registrate</Button>
        </Stack>
      </Stack>
    </div>
  );
}
export default LoginPage;