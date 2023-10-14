import React, { useState } from 'react';
import { Credit, Debit } from '../classes/card'
import axios from 'axios';
import Cookies from 'js-cookie';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function RegisterCard({ onBack }) {
  //Logica para Registrar Tarjetas
  const userId = Cookies.get('userId');
  const [value, setValue] = React.useState(0);
  const [formData, setFormData] = useState({
    cardNumber: '',
    accountNumber: userId,
    expireDate: null,
    coin: '',
    minimum: '',
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
  
  const handleSubmitDebit = async (e) => {
    e.preventDefault();
    const newDebit = new Debit(formData.cardNumber, formData.accountNumber, formData.expireDate, formData.coin, formData.minimum);
    try {
      await axios.post('http://localhost:3000/guardar-debito', newDebit);
      console.log('Datos enviados con éxito');
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    } 
    onBack(); 
  };
  const handleSubmitCredit = async (e) => {
    e.preventDefault();
    const newCredit = new Credit(formData.cardNumber, formData.accountNumber, formData.expireDate, formData.coin, formData.billingDate, formData.interestRate, formData.creditLine, formData.lastDayPayment);
    try {
      await axios.post('http://localhost:3000/guardar-credito', newCredit);
      console.log('Datos enviados con éxito');
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    } 
    onBack(); 
  };
  //Logica para Fechas
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };
  //Logica para Pestañas
  const handleTab = (event, newValue) => {
    setValue(newValue);
  };
  //Logica para correcto formato
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
  
  const isValidCreditLine = (creditLine) => {
    return creditLine === '' || (!isNaN(creditLine) && creditLine !== '' && creditLine >= 0);
  };
  
  const isValidInterestRate = (interestRate) => {
    const rate = parseFloat(interestRate);
    return interestRate === '' || (!isNaN(rate) && rate >= 0 && rate <= 1);
  };
  
  //Logica para PERMITIR Registrar
  const isDebitButtonEnabled = () => {
    return (
      formData.cardNumber.trim() !== '' &&
      formData.expireDate !== null &&
      formData.coin.trim() !== '' &&
      formData.minimum.trim() !== '' &&
      isValidCardNumber(formData.cardNumber) &&
      isValidCoin(formData.coin) &&
      isValidMinimum(formData.minimum)
    );
  };
  const isCreditButtonEnabled = () => {
    return (
      formData.cardNumber.trim() !== '' &&
      formData.expireDate !== null &&
      formData.coin.trim() !== '' &&
      formData.billingDate !== null &&
      formData.interestRate.trim() !== '' &&
      formData.creditLine.trim() !== '' &&
      formData.lastDayPayment !== null &&
      isValidCardNumber(formData.cardNumber) &&
      isValidCoin(formData.coin) &&
      isValidCreditLine(formData.creditLine)
    );
  };

  return (
    <div>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <h2>Registrar Tarjeta</h2>
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
        <Tabs value={value} onChange={handleTab} centered>
          <Tab label="Debito" />
          <Tab label="Credito" />
        </Tabs>
        <TabPanel value={value} index={0}>
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
              <Button
                variant="contained"
                type="submit"
                onClick={handleSubmitDebit}
                disabled={!isDebitButtonEnabled()}
              >
                Regístrar Debito
              </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Fecha de Facturacion"
                  name="billingDate"
                  value={formData.billingDate}
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
                  onChange={(date) => handleDateChange("lastDayPayment", date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Stack>
            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmitCredit}
              disabled={!isCreditButtonEnabled()} 
            >
              Regístrar Credito
            </Button>
          </Stack>
        </TabPanel>
      </Stack>
      <button onClick={onBack}>Atrás</button>
    </div>
  );
}

export default RegisterCard;