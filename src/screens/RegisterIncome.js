import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack, Button, TextField, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../App.css';

function RegisterIncome({ onBack }) {
    const [error, setError] = useState('');       // Alerta de error para el Formulario
    const [formData, setFormData] = useState({
        income: '',
    }); //Data de Formulario

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }; //Encargado de manejar los cambios de cada formulario (En vivo y en directo)

    const sumCash = () => {
        const debitCardId = Cookies.get('debitCardId');
        if (debitCardId) {
            axios.post('http://localhost:3000/actualizar-cash', {
                debitCardId,
                income: formData.income,
            })
                .then((response) => {
                    console.log('Ingreso registrado con éxito');
                    onBack();
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.error) {
                        setError(error.response.data.error);
                    } else {
                        setError("Error desconocido al registrar el ingreso");
                    }
                });
        }
    } //Función para poder sumar o ingresar el monto

    //Código necesario para un correcto formato
    const isValid = (income) => {
        const incomeRegex = /^\d+$/;
        return income === '' || incomeRegex.test(income);
    };
    const isButtonEnabled = () => {
        return (
          formData.income.trim() !== '' &&
          isValid(formData.income)
        );
      };

    //Propiedades comunes de la página
    const rowStackProps = {
        direction: "row",
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    };
    const columnStackProps = {
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    };

    return (
        <div className='whiteBoxRP'> {/*Caja Blanca*/}
            <br />
            <IconButton color="primary" aria-label="Back to CardScreen" onClick={() => onBack()}>
                <ArrowBackIcon />
            </IconButton>
            <Stack {...columnStackProps}> {/*Formulario de Registrar Ingreso*/}
                <h2>Registrar Ingreso</h2>
                <p>Aqui puedes registrar ingresos a tu tarjeta de debito.</p>
                <Stack {...rowStackProps}>
                    <TextField required label="Monto" name="income" value={formData.income} onChange={handleChange}
                        error={!isValid(formData.income)}
                        helperText={ !isValid(formData.income) ? 'Monto inválido' : '' } />
                </Stack>
                <Stack {...rowStackProps}>
                    <Button variant="contained" onClick={() => { sumCash(); }} disabled={!isButtonEnabled()} > Registrar </Button>
                </Stack>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Stack>
        </div>
    );
}

export default RegisterIncome;