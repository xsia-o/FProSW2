import React, { useState, useEffect } from 'react';
import { User } from '../classes/user';
import axios from 'axios';
import { Stack, Button, TextField, IconButton, InputAdornment, Switch, FormControlLabel } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import '../App.css';

function RegisterPage({ onNavigate }) {
  const [error, setError] = useState('');     // Alerta de error en el Formulario
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  }); //Data de formulario

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }; //Encargado de manejar los cambios de cada formulario (En vivo y en directo)

  useEffect(() => {
    setIsButtonDisabled(!checkFormCompletion());
    // eslint-disable-next-line
  }, [formData, termsAccepted, emailError, phoneError]); //Se verificará si se completaron todos los campos

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = new User(formData.fname, formData.lname, '', 0, formData.email, formData.phone, formData.username, formData.password);
    try {
      await axios.post('http://localhost:3000/guardar-usuarios', newUser);
      console.log('Datos enviados con éxito');
      onNavigate();
    } catch (error) {
      setError('Correo ya registrado');
    }
  }; //Funcion para registrar Usuario

  //Código necesario para un correcto formato
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };
  const isValidPhone = (phone) => {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(phone);
  };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    setEmailError(email.trim() !== '' && !isValidEmail(email) ? 'Correo electrónico inválido' : '');
  };
  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });
    setPhoneError(phone.trim() !== '' && !isValidPhone(phone) ? 'Formato Inválido' : '');
  };
  //Codigo necesario para permitir Registrar
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const handleTermsAcceptance = () => {
    setTermsAccepted(!termsAccepted);
  };
  const checkFormCompletion = () => {
    const { fname, lname, email, phone, username, password } = formData;
    return fname &&
      lname &&
      email &&
      phone &&
      username &&
      password &&
      termsAccepted &&
      !emailError &&
      !phoneError;
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
    <div className='whiteBoxRP'> {/*Caja Blanca*/}
      <IconButton color="primary" aria-label="back to login" onClick={() => onNavigate()}>
        <ArrowBackIcon />
      </IconButton>
      <Stack {...columnStackProps}> {/*Formulario de Registrar Cuenta*/}
        <h2>Registrarse</h2>
        <p>Completa los datos requeridos:</p>
        <Stack {...rowStackProps}>
          <TextField required label="Nombre" name="fname" value={formData.fname} onChange={handleChange} />
          <TextField required label="Apellido" name="lname" value={formData.lname} onChange={handleChange} />
        </Stack>
        <Stack {...rowStackProps}>
          <TextField required label="Correo Electrónico" name="email" value={formData.email} onChange={handleEmailChange}
            error={emailError !== ''}
            helperText={emailError} />
          <TextField required label="Telefono" name="phone" value={formData.phone} onChange={handlePhoneChange}
            error={phoneError !== ''}
            helperText={phoneError} />
        </Stack>
        <Stack {...rowStackProps}>
          <TextField required label="Nombre de Usuario" name="username" value={formData.username} onChange={handleChange} />
          <TextField label="Contraseña" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} InputProps={passwordProps} />
        </Stack>
        <FormControlLabel required control={<Switch checked={termsAccepted} onChange={handleTermsAcceptance} />}
          label="Acepto los términos y condiciones de la aplicación."
          labelPlacement="start" />
        <Button variant="contained" type="submit" onClick={handleSubmit} disabled={isButtonDisabled}> Regístrate </Button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </Stack>
    </div>
  );
}
export default RegisterPage;