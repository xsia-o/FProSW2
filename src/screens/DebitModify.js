import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack, TextField, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../App.css';

function DebitModify({ onBack }) {
    const debitCardId = Cookies.get('debitCardId'); // Se obtiene la Tarjeta de Debito Actual
    const [formData, setFormData] = useState({
        cardNumber: '',
        accountNumber: '',
        expireDate: null,
    }); //Data de formulario

    const handleRequestError = (error) => {
        if (error.response && error.response.data && error.response.data.error) {
            console.error(error.response.data.error);
        } else {
            console.error("Error desconocido al actualizar la cuenta");
        }
    }; //Encargado de manejar los errores del servidor

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }; //Encargado de manejar los cambios del formulario (En vivo y en directo)

    const handleDateChange = (name, date) => {
        setFormData({
            ...formData,
            [name]: date,
        });
    }; //Encargado de manejar las fechas del formulario

    useEffect(() => {
        const debitCardId = Cookies.get('debitCardId');
        if (debitCardId) {
            axios.post('http://localhost:3000/obtener-debito-por-id', { debitCardId })
                .then((response) => {
                    const debitCardData = response.data;
                    setFormData({
                        cardNumber: debitCardData.cardnumber,
                        accountNumber: debitCardData.accountnumber,
                    });
                })
                .catch((error) => {
                    handleRequestError(error);
                });
        }
    }, []); //Se obtendra la informacion de la Tarjeta de Debito Actual

    const updateDebitCard = () => {
        if (debitCardId) {
            axios.post('http://localhost:3000/actualizar-debito', {
                debitCardId,
                cardNumber: formData.cardNumber,
                accountNumber: formData.accountNumber,
                expireDate: formData.expireDate,
            })
                .then((response) => {
                    console.log('Tarjeta de débito actualizada con éxito');
                })
                .catch((error) => {
                    handleRequestError(error);
                });
        }
    }; //Función para poder actualizar la Tarjeta de Debito Actual

    //Código necesario para un correcto formato
    const isValidCardNumber = (cardNumber) => {
        const cardNumberRegex = /^\d{16}$/;
        return cardNumber === '' || cardNumberRegex.test(cardNumber);
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
    return (
        <div className='whiteBoxDM'> {/*Caja Blanca*/}
            <Stack {...columnStackProps}> {/*Formulario de Modificacion de Tarjeta de Credito*/}
                <h2>Modificar Tarjeta Debito</h2>
                <p>Completa los datos de tu tarjeta:</p>
                <Stack {...rowStackProps}>
                    <TextField required label="Numero de Tarjeta" name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                        error={!isValidCardNumber(formData.cardNumber)}
                        helperText={
                            !isValidCardNumber(formData.cardNumber) ? 'Número de tarjeta inválido' : ''} />
                </Stack>
                <Stack {...rowStackProps}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Fecha de Vencimiento" name="expireDate" value={formData.expireDate} views={['month', 'year']} onChange={(date) => handleDateChange("expireDate", date)} />
                    </LocalizationProvider>

                </Stack>
                <Stack {...rowStackProps}>
                    <Button variant="contained" onClick={() => { updateDebitCard(); onBack(); }} > Actualizar Débito </Button>
                </Stack>
            </Stack>
        </div>
    );
}
export default DebitModify;