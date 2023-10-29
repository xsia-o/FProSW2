import React, { useState, useEffect } from 'react';
import {
    Cookies,
    axios,
    Stack,
    TextField,
    Button,
    AdapterDayjs,
    LocalizationProvider,
    DatePicker,
} from './abbr-lib';
import '../App.css';
function DebitModify({ onBack }) {
    //Logica para obtener Datos Almacenados
    const [formData, setFormData] = useState({
        cardNumber: '',
        accountNumber: '',
        expireDate: null,
        coin: '',
        minimum: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    useEffect(() => {
        const debitCardId = Cookies.get('debitCardId');
        if (debitCardId) {
            axios.post('http://localhost:3000/obtener-debito-por-id', { debitCardId })
                .then((response) => {
                    const debitCardData = response.data;
                    setFormData({
                        cardNumber: debitCardData.cardnumber,
                        accountNumber: debitCardData.accountnumber,
                        coin: debitCardData.coin,
                        minimum: debitCardData.minimum,
                    });
                })
                .catch((error) => {
                    console.error('Error al obtener la tarjeta de débito:', error);
                });
        }
    }, []);
    //Logica para actualizar Tarjeta Debito
    const updateDebitCard = () => {
        const debitCardId = Cookies.get('debitCardId');
        if (debitCardId) {
            axios.post('http://localhost:3000/actualizar-debito', {
                debitCardId,
                cardNumber: formData.cardNumber,
                accountNumber: formData.accountNumber,
                expireDate: formData.expireDate,
                coin: formData.coin,
                minimum: formData.minimum,
            })
                .then((response) => {
                    console.log('Tarjeta de débito actualizada con éxito');
                })
                .catch((error) => {
                    console.error('Error al actualizar la tarjeta de débito:', error);
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
    const isValidMinimum = (minimum) => {
        return minimum === '' || (!isNaN(minimum) && minimum !== '' && minimum >= 0);
    };
    return (
        <div>
            <Stack className="whiteBoxDM" direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <h2>Modificar Tarjeta Debito</h2>
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
                <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Ingreso Minimo"
                            name="minimum"
                            value={formData.minimum}
                            onChange={handleChange}
                            error={!isValidMinimum(formData.minimum)}
                            helperText={!isValidMinimum(formData.minimum) ? 'Ingreso mínimo inválido' : ''}
                        />
                    </Stack>
                    <Button variant="contained" onClick={() => { updateDebitCard(); onBack(); }} > Actualizar Débito </Button>
                </Stack>
            </Stack>

        </div>
    );
}
export default DebitModify;