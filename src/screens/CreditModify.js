import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../App.css';

function CreditModify({onBack}){
    //Logica para obtener Datos Almacenados
    const [formData, setFormData] = useState({
        cardNumber: '',
        accountNumber: '',
        expireDate: null,
        coin: '',
        billingDate: null,
        interestRate: '',
        creditLine: '',
        lastDayPayment: null,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };
    useEffect(() => {
        const creditCardId = Cookies.get('creditCardId');
        if (creditCardId ) {
          axios.post('http://localhost:3000/obtener-credito-por-id', { creditCardId })
            .then((response) => {
              const creditCardData = response.data;
              setFormData({
                cardNumber: creditCardData.cardnumber,
                accountNumber: creditCardData.accountnumber,
                coin: creditCardData.coin,
                interestRate: creditCardData.interestrate,
                creditLine: creditCardData.creditline,
              });
            })
            .catch((error) => {
              console.error('Error al obtener la tarjeta de crédito:', error);
            });
        }
    }, []);
    //Logica para actualizar Tarjeta Credito
    const updateCreditCard = () => {
        const creditCardId = Cookies.get('debitCardId');
        if (creditCardId) {
          axios.post('http://localhost:3000/actualizar-credito', {
            creditCardId,
            cardNumber: formData.cardnumber,
            accountNumber: formData.accountnumber,
            expireDate: formData.expireDate,
            coin: formData.coin,
            billingDate: formData.billingDate,
            interestRate: formData.interestRate,
            creditLine: formData.creditLine,
            lastDayPayment: formData.lastDayPayment,
          })
            .then((response) => {
              console.log('Tarjeta de crédito actualizada con éxito');
            })
            .catch((error) => {
              console.error('Error al actualizar la tarjeta de crédito:', error);
            });
        }
    };
    //Logica para Fechas
    const handleDateChange = (name, date) => {
        setFormData({
        ...formData,
        [name]: date,
        });
    };
    //Logica para correcto formato (Faltan fechas)
    const isValidCardNumber = (cardNumber) => {
        const cardNumberRegex = /^\d{16}$/;
        return cardNumber === '' || cardNumberRegex.test(cardNumber);
    };
    const isValidCoin = (coin) => {
        return coin === '' || coin.length <= 10;
    };
    const isValidCreditLine = (creditLine) => {
        return creditLine === '' || (!isNaN(creditLine) && creditLine !== '' && creditLine >= 0);
      };
      
      const isValidInterestRate = (interestRate) => {
        const rate = parseFloat(interestRate);
        return interestRate === '' || (!isNaN(rate) && rate >= 0 && rate <= 1);
      };
      
    
    return (
        <div>
            <Stack className="whiteBox" direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <h2>Modificar Tarjeta Credito</h2>
                <p>Completa los datos de tu tarjeta:</p>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <TextField
                    required
                    id="outlined-required"
                    label="Numero de Tarjeta"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    error={!isValidCardNumber(formData.cardNumber)}
                    helperText={
                    !isValidCardNumber(formData.cardNumber) ? 'Número de tarjeta inválido' : ''
                    }
                />
                </Stack>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    label="Fecha de Vencimiento"
                    name="expireDate"
                    value={formData.expireDate}
                    views={['month', 'year']}
                    onChange={(date) => handleDateChange("expireDate", date)}
                    renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <TextField
                    required
                    id="outlined-required"
                    label="Moneda"
                    name="coin"
                    value={formData.coin}
                    onChange={handleChange}
                    error={!isValidCoin(formData.coin)}
                    helperText={!isValidCoin(formData.coin) ? 'Moneda inválida' : ''}
                />
                </Stack>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                        label="Fecha de Facturacion"
                        name="billingDate"
                        value={formData.billingDate}
                        views={['day','month']}
                        onChange={(date) => handleDateChange("billingDate", date)}
                        renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <TextField
                        required
                        id="outlined-required"
                        label="Tasa de Interes"
                        name="interestRate"
                        value={formData.interestRate}
                        onChange={handleChange}
                        error={!isValidInterestRate(formData.interestRate)}
                        helperText={!isValidInterestRate(formData.interestRate) ? 'Tasa de interés inválida' : ''}
                    />
                </Stack>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Linea de Credito"
                        name="creditLine"
                        value={formData.creditLine}
                        onChange={handleChange}
                        error={!isValidCreditLine(formData.creditLine)}
                        helperText={!isValidCreditLine(formData.creditLine) ? 'Línea de crédito inválida' : ''}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                        label="Ultimo Dia de Pago"
                        name="lastDayPayment"
                        value={formData.lastDayPayment}
                        views={['day','month']}
                        onChange={(date) => handleDateChange("lastDayPayment", date)}
                        renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Stack>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                    <Button
                            variant="contained"
                            onClick={() => {
                            updateCreditCard();
                            onBack();
                            }}
                        >
                            Actualizar Crédito
                    </Button>
                </Stack>
            </Stack>
            
        </div>

    );
}

export default CreditModify;