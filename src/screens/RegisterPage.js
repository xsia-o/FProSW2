import React, { useState,  useEffect  } from 'react';
import { User } from '../classes/user';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../App.css';

function RegisterPage({ onNavigate }) {
  //Logica para Registrar Usuarios
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    username: '',
    password: '',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = new User(formData.fname, formData.lname, '', 0, formData.email, formData.phone, formData.username, formData.password);
    try {
      await axios.post('http://localhost:3000/guardar-usuarios', newUser);
      console.log('Datos enviados con éxito');
      onNavigate(); 
    } catch (error) {
      setError('Correo ya registrado');
      //console.error('Error al enviar los datos:', error);
    } 
  };

  //Logica para correcto formato
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

  //Logica para PERMITIR Registrar
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

  useEffect(() => {
    setIsButtonDisabled(!checkFormCompletion());
    // eslint-disable-next-line
  }, [formData, termsAccepted, emailError, phoneError]);

  //Logica para Mostrar/Ocultar contraseña 
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className='whiteBox'>
      <IconButton color="primary" aria-label="back to login" onClick={() => onNavigate()}>
        <ArrowBackIcon/>
      </IconButton>

      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <h2>Registrarse</h2>
        <p>Completa los datos requeridos:</p>

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <TextField
          required
          label="Nombres"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
        />
        <TextField
          required
          label="Apellidos"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
        />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <TextField
          required
          label="Correo Electrónico"
          name="email"
          value={formData.email}
          onChange={handleEmailChange}
          error={emailError !== ''}
          helperText={emailError}
        />
        <TextField
          required
          label="Telefono"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          error={phoneError !== ''}
          helperText={phoneError}
        />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <TextField
          required
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
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
        </Stack>
        <FormControlLabel
          required
          control={<Switch checked={termsAccepted} onChange={handleTermsAcceptance} />}
          label="Acepto los términos y condiciones de la aplicación."
          labelPlacement="start"
        />
        <Button variant="contained" type="submit" onClick={handleSubmit} disabled={isButtonDisabled}>
          Regístrate
        </Button>
        {error && <div style={{ color: 'red' }}>{error}</div>}    
      </Stack>
    </div>
  );
}

export default RegisterPage;
      