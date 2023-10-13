import React, { useState,  useEffect  } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function RegisterPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { ...formData };
    console.log(userData);
    try {
      await axios.post('http://localhost:3000/guardar-usuarios', formData);
      console.log('Datos enviados con éxito');
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    } 
    onNavigate(); 
  };
  
  const handleTermsAcceptance = () => {
    setTermsAccepted(!termsAccepted);
  };
  const checkFormCompletion = () => {
    const { fname, lname, email, phone, password } = formData;
    return fname && lname && email && phone && password && termsAccepted;
  };

  useEffect(() => {
    setIsButtonDisabled(!checkFormCompletion());
    // eslint-disable-next-line
  }, [formData, termsAccepted]); 

  return (
    <div>
      <IconButton color="primary" aria-label="back to login" onClick={() => onNavigate()}>
        <ArrowBackIcon/>
      </IconButton>

      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <h2>Registrarse</h2>
        <p>Completa los datos requeridos:</p>

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <TextField
          required
          id="outlined-required"
          label="Nombres"
          name="fname"
          value={formData.fname}
          onChange={handleChange}
        />
        <TextField
          required
          id="outlined-required"
          label="Apellidos"
          name="lname"
          value={formData.lname}
          onChange={handleChange}
        />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <TextField
          required
          id="outlined-required"
          label="Correo Electronico"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          required
          id="outlined-required"
          label="Telefono"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <TextField
          required
          id="outlined-password-input"
          label="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          required
          id="outlined-password-input"
          label="Confirmar contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
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
      </Stack>
    </div>
  );
}

export default RegisterPage;
      