import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack, TextField, Button } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import '../App.css';

function CreditModify({ onBack }) {
    const creditCardId = Cookies.get('creditCardId'); // Se obtiene la Tarjeta de Credito Actual
    const [formData, setFormData] = useState({
        cardNumber: '',
        accountNumber: '',
        expireDate: null,
        billingDate: null,
        interestRate: '',
        creditLine: '',
        lastDayPayment: null,
        insurance: '',
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
        let creditCardId = Cookies.get('creditCardId');
        if (creditCardId) {
            axios.post('http://localhost:3000/obtener-credito-por-id', { creditCardId })
                .then((response) => {
                    const creditCardData = response.data;
                    setFormData({
                        cardNumber: creditCardData.cardnumber,
                        accountNumber: creditCardData.accountnumber,
                        interestRate: creditCardData.interestrate,
                        creditLine: creditCardData.creditline,
                        insurance: creditCardData.insurance,
                    });
                })
                .catch((error) => {
                    handleRequestError(error);
                });
        }
    }, []); //Se obtendra la informacion de la Tarjeta de Credito Actual

    const updateCreditCard = () => {
        if (creditCardId) {
            axios.post('http://localhost:3000/actualizar-credito', {
                creditCardId,
                cardNumber: formData.cardNumber,
                accountNumber: formData.accountNumber,
                expireDate: formData.expireDate,
                billingDate: formData.billingDate,
                interestRate: formData.interestRate,
                creditLine: formData.creditLine,
                lastDayPayment: formData.lastDayPayment,
                insurance: formData.insurance,
            })
                .then((response) => {
                    console.log('Tarjeta de crédito actualizada con éxito');
                })
                .catch((error) => {
                    handleRequestError(error);
                });
        }
    }; //Función para poder actualizar la Tarjeta de Credito Actual

    //Código necesario para un correcto formato
    const isValidCardNumber = (cardNumber) => {
        const cardNumberRegex = /^\d{16}$/;
        return cardNumber === '' || cardNumberRegex.test(cardNumber);
    };
    const isValidCreditLine = (creditLine) => {
        return creditLine === '' || (!isNaN(creditLine) && creditLine !== '' && creditLine >= 0);
    };
    const isValidInterestRate = (interestRate) => {
        const rate = parseFloat(interestRate);
        return interestRate === '' || (!isNaN(rate) && rate >= 0 && rate <= 1);
    };
    const isValidInsurance = (insurance) => {
        return insurance === '' || (!isNaN(insurance) && insurance !== '' && insurance >= 0);
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
        <div className='whiteBoxCM'> {/*Caja Blanca*/}
            <Stack {...columnStackProps}> {/*Formulario de Modificacion de Tarjeta de Credito*/}
                <h2>Modificar Tarjeta Credito</h2>
                <p>Completa los datos de tu tarjeta:</p>
                <Stack {...rowStackProps}>
                    <TextField required label="Numero de Tarjeta" name="cardNumber" value={formData.cardNumber} onChange={handleChange}
                        error={!isValidCardNumber(formData.cardNumber)}
                        helperText={!isValidCardNumber(formData.cardNumber) ? 'Número de tarjeta inválido' : ''} />
                </Stack>
                <Stack {...rowStackProps}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Fecha de Vencimiento" name="expireDate" value={formData.expireDate} views={['month', 'year']} onChange={(date) => handleDateChange("expireDate", date)} />
                    </LocalizationProvider>
                </Stack>
                <Stack {...rowStackProps}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Fecha de Facturacion" name="billingDate" value={formData.billingDate} views={['day', 'month']} onChange={(date) => handleDateChange("billingDate", date)} />
                    </LocalizationProvider>
                    <TextField required label="Tasa de Interes" name="interestRate" value={formData.interestRate} onChange={handleChange}
                        error={!isValidInterestRate(formData.interestRate)}
                        helperText={!isValidInterestRate(formData.interestRate) ? 'Tasa de interés inválida' : ''} />
                </Stack>
                <Stack {...rowStackProps}>
                    <TextField required label="Linea de Credito" name="creditLine" value={formData.creditLine} onChange={handleChange}
                        error={!isValidCreditLine(formData.creditLine)}
                        helperText={!isValidCreditLine(formData.creditLine) ? 'Línea de crédito inválida' : ''} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Ultimo Dia de Pago" name="lastDayPayment" value={formData.lastDayPayment} views={['day', 'month']} onChange={(date) => handleDateChange("lastDayPayment", date)} />
                    </LocalizationProvider>
                </Stack>
                <Stack {...rowStackProps}>
                    <TextField required label="Seguro de Desgravamen" name="insurance" value={formData.insurance} onChange={handleChange}
                        error={!isValidInsurance(formData.insurance)}
                        helperText={!isValidInsurance(formData.insurance) ? 'Monto inválido' : ''} />
                </Stack>
                <Stack {...rowStackProps}>
                    <Button variant="contained" onClick={() => { updateCreditCard(); onBack(); }} > Actualizar Crédito </Button>
                </Stack>
            </Stack>
        </div>
    );
}
export default CreditModify;