import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack, Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import '../App.css';

function AccountPage({ onBack, onLogoff }) {
  const userId = Cookies.get('userId');       // Se obtiene el UserId de las "Cookies"
  const [error, setError] = useState('');     // Alerta de error para el Editar Cuenta
  const [error2, setError2] = useState('');   // Alerta de error para el Cambiar Contraseña
  const [error3, setError3] = useState('');   // Alerta de error para el Eliminar Cuenta
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    username: '',
    dni: '',
    age: '',
    password4Update: '',
    password4Delete: '',
    password2Update: '',
    newPass: '',
    newPassVali: '',
  });  //Data de formulario, para las 3 partes: Editar, Cambiar, y Eliminar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }; //Encargado de manejar los cambios de cada formulario (En vivo y en directo)

  useEffect(() => {
    let userId = Cookies.get('userId');
    if (userId) {
      axios.post('http://localhost:3000/obtener-cuenta', { userId })
        .then((response) => {
          const userData = response.data;
          setFormData({
            fname: userData.fname,
            lname: userData.lname,
            email: userData.email,
            phone: userData.phone,
            username: userData.username,
            dni: userData.dni,
            age: userData.age,
          });
        })
        .catch((error) => {
          console.error('Error al obtener cuenta.', error);
        });
    }
  }, []); //Se obtendra la cuenta una vez se cargue la pagina


  const updateAccount = () => {
    if (userId) {
      axios.post('http://localhost:3000/actualizar-cuenta', {
        userId,
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        phone: formData.phone,
        username: formData.username,
        password: formData.password4Update,
        dni: formData.dni,
        age: formData.age,
      })
        .then((response) => {
          console.log('Cuenta actualizada con éxito');
          onBack();
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            setError(error.response.data.error);
          } else {
            setError("Error desconocido al actualizar la cuenta");
          }
        });
    }
  }; //Función para poder obtener actualizar la cuenta

  const updatePassword = () => {
    if (userId) {
      axios.post('http://localhost:3000/actualizar-contrasena', {
        userId,
        password: formData.password2Update,
        newPass: formData.newPass,
        newPassVali: formData.newPassVali,
      })
        .then((response) => {
          console.log('Contraseña actualizada con éxito');
          onBack();
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            setError2(error.response.data.error);
          } else {
            setError2("Error desconocido al actualizar la contraseña");
          }
        });
    }
  }; //Función para poder actualizar la contraseña

  const closeAccount = () => {
    if (userId) {
      axios.post('http://localhost:3000/eliminar-cuenta', {
        userId,
        password: formData.password4Delete,
      })
        .then((response) => {
          console.log('Cuenta borrada con éxito');
          onLogoff();
        })
        .catch((error) => {
          if (error.response && error.response.data && error.response.data.error) {
            setError3(error.response.data.error);
          } else {
            setError3("Error desconocido al eliminar la cuenta");
          }
        });
    }
  }; //Función para poder borrar o cerrar la cuenta

  //Código necesario para un correcto formato
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    phone: '',
    dni: '',
    age: '',
  });
  const isValidField = (value, regex) => regex.test(value);
  const handleFieldChange = (fieldName, value, regex, errorMessage) => {
    setFormData({ ...formData, [fieldName]: value });
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: isValidField(value, regex) ? '' : errorMessage,
    }));
  };
  const handleEmailChange = (e) => { handleFieldChange('email', e.target.value, /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Correo electrónico inválido'); };
  const handlePhoneChange = (e) => { handleFieldChange('phone', e.target.value, /^\d{9}$/, 'Numero Inválido'); };
  const handleDniChange = (e) => { handleFieldChange('dni', e.target.value, /^\d{8}$/, 'Documento Inválido'); };
  const handleAgeChange = (e) => { handleFieldChange('age', e.target.value, /^\d+$/, 'Formato Inválida'); };

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
      <br />
      <IconButton color="primary" aria-label="Back to FrontPage" onClick={() => onBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Stack {...columnStackProps}>
        <h2>Mi Cuenta</h2> 
        <p>Aqui puedes administrar tu cuenta</p>
        <div style={{ maxHeight: "650px", overflowY: "auto" }}> {/*Deslizante*/}
          <Stack {...columnStackProps}> {/*Formulario de Editar Cuenta*/}
            <br />
            <Stack {...rowStackProps}>
              <TextField required label="Nombres" name="fname" value={formData.fname} onChange={handleChange} />
              <TextField required label="Apellidos" name="lname" value={formData.lname} onChange={handleChange} />
            </Stack>
            <Stack {...rowStackProps}>
              <TextField required label="Correo Electrónico" name="email" value={formData.email} onChange={handleEmailChange} error={fieldErrors.email !== ''} helperText={fieldErrors.email} />
              <TextField required label="Telefono" name="phone" value={formData.phone} onChange={handlePhoneChange} error={fieldErrors.phone !== ''} helperText={fieldErrors.phone} />
            </Stack>
            <Stack {...rowStackProps}>
              <TextField required label="Documento de Identidad" name="dni" value={formData.dni} onChange={handleDniChange} error={fieldErrors.dni !== ''} helperText={fieldErrors.dni} />
              <TextField required label="Edad" name="age" value={formData.age} onChange={handleAgeChange} error={fieldErrors.age !== ''} helperText={fieldErrors.age} />
            </Stack>
            <Stack {...rowStackProps}>
              <TextField label="Username" name="username" value={formData.username} onChange={handleChange} />
              <TextField label="Contraseña" type={showPassword ? 'text' : 'password'} name="password4Update" value={formData.password4Update} onChange={handleChange} InputProps={passwordProps} />
            </Stack>
            <Stack {...columnStackProps}>
              <Button variant="contained" onClick={() => { updateAccount(); }} > Actualizar Cuenta </Button>
            </Stack>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <br />
            <h2>Cambiar contraseña</h2> {/*Formulario de Editar Contraseña*/}
            <Stack {...rowStackProps}>
              <TextField label="Contraseña antigua" type={showPassword ? 'text' : 'password'} name="password2Update" value={formData.password2Update} onChange={handleChange} InputProps={passwordProps} />
            </Stack>
            <Stack {...rowStackProps}>
              <TextField label="Contraseña nueva" type={showPassword ? 'text' : 'password'} name="newPass" value={formData.newPass} onChange={handleChange} InputProps={passwordProps} />
              <TextField label="Confirmar contraseña" type={showPassword ? 'text' : 'password'} name="newPassVali" value={formData.newPassVali} onChange={handleChange} InputProps={passwordProps} />
            </Stack>
            <Button variant="contained" onClick={() => { updatePassword(); }} > Cambiar Contraseña </Button>
            {error2 && <div style={{ color: 'red' }}>{error2}</div>}
            <br />
            <h2>Cerrar cuenta</h2> {/*Formulario de Eliminar Cuenta*/}
            <Stack {...rowStackProps}>
              <TextField label="Contraseña" type={showPassword ? 'text' : 'password'} name="password4Delete" value={formData.password4Delete} onChange={handleChange} InputProps={passwordProps} />
            </Stack>
            <Button color="error" variant="contained" onClick={() => { closeAccount(); }} > Borrar Cuenta </Button>
            {error3 && <div style={{ color: 'red' }}>{error3}</div>}
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

export default AccountPage;