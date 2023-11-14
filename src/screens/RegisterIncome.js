import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../App.css';
function RegisterIncome({ onBack }) {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        income: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
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
    }
    const isValid = (income) => {
        const incomeRegex = /^\d+$/;
        return income === '' || incomeRegex.test(income);
    };
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
        <div className='whiteBoxRP' style={{ maxHeight: "400px", overflowY: "auto" }}>
            <br />
            <IconButton color="primary" aria-label="back to login" onClick={() => onBack()}>
                <ArrowBackIcon />
            </IconButton>
            <Stack {...columnStackProps}>
                <h2>Registrar Ingreso</h2>
                <p>Aqui puedes registrar ingresos a tu tarjeta de debito.</p>
                <Stack {...rowStackProps}>
                    <TextField required label="Monto" name="income" value={formData.income} onChange={handleChange} 
                    error={!isValid(formData.income)}
                    helperText={
                        !isValid(formData.income) ? 'Monto inválido' : ''
                    }
                    />
                </Stack>
                <Stack {...columnStackProps}>
                    <Button variant="contained" onClick={() => { sumCash(); }} > Registrar </Button>
                </Stack>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </Stack>

        </div>
    );
}

export default RegisterIncome;
