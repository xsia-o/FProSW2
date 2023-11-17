import React, { useState } from 'react';
import { Credit, Debit } from '../classes/card'
import axios from 'axios';
import Cookies from 'js-cookie';
import { Stack, TextField, Button, Tabs, Tab, Box, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../App.css';

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
} //Función necesaria para el funcionamiento de Pestañas

function RegisterCard({ onBack }) {
  const userId = Cookies.get('userId');         // Se obtiene el UserId de las "Cookies"
  const [value, setValue] = React.useState(0);  // Valor para intercambiar indices de Pestañas
  const [formData, setFormData] = useState({
    cardNumber: '',
    accountNumber: userId,
    expireDate: null,
    coin: '',
    cash: '',
    billingDate: null,
    interestRate: '',
    creditLine: '',
    lastDayPayment: null,
    insurance: '',
  }); //Data de formulario, para Tarjeta Credito o Debito

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }; //Encargado de manejar los cambios de cada formulario (En vivo y en directo)

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  }; //Encargado de manejar las fechas

  const handleTab = (event, newValue) => {
    setValue(newValue);
  }; // Encargado de intercambiar Pestañas

  const handleSubmitCard = async (e, tipoTarjeta) => {
    e.preventDefault();
    let newCard;
    if (tipoTarjeta === 'debito') {
      newCard = new Debit(formData.cardNumber, formData.accountNumber, formData.expireDate, formData.coin, formData.cash);
    } else if (tipoTarjeta === 'credito') {
      newCard = new Credit(formData.cardNumber, formData.accountNumber, formData.expireDate, formData.coin, formData.billingDate, formData.interestRate, formData.creditLine, formData.lastDayPayment, formData.creditLine, formData.insurance);
    } else {
      console.error('Tipo de tarjeta no válido:', tipoTarjeta);
      return;
    }
    try {
      await axios.post(`http://localhost:3000/guardar-${tipoTarjeta}`, newCard);
      console.log('Datos enviados con éxito');
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
    onBack();
  }; //Función para poder añadir Tarjeta Debito o Credito

  //Código necesario para un correcto formato
  const isValidCardNumber = (cardNumber) => {
    const cardNumberRegex = /^\d{16}$/;
    return cardNumber === '' || cardNumberRegex.test(cardNumber);
  };
  const isValidCoin = (coin) => {
    return coin === '' || coin.length <= 10;
  };
  const isValidCash = (cash) => {
    return cash === '' || (!isNaN(cash) && cash !== '' && cash >= 0);
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

  //Codigo necesario para permitir Registrar
  const isDebitButtonEnabled = () => {
    return (
      formData.cardNumber.trim() !== '' &&
      formData.expireDate !== null &&
      formData.coin.trim() !== '' &&
      formData.cash.trim() !== '' &&
      isValidCardNumber(formData.cardNumber) &&
      isValidCoin(formData.coin) &&
      isValidCash(formData.cash)
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
      formData.insurance.trim() !== '' &&
      isValidCardNumber(formData.cardNumber) &&
      isValidCoin(formData.coin) &&
      isValidCreditLine(formData.creditLine) &&
      isValidInsurance(formData.insurance)
    );
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
    <div className="whiteBoxRC"> {/*Caja Blanca*/}
      <br />
      <IconButton color="primary" aria-label="Back to CardScreen" onClick={() => onBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Stack {...columnStackProps}>
        <h2>Registrar Tarjeta</h2>
        <p>Completa los datos de tu tarjeta:</p>
        <Stack {...rowStackProps}>
          <TextField required label="Numero de Tarjeta" name="cardNumber" value={formData.cardNumber} onChange={handleChange}
            error={!isValidCardNumber(formData.cardNumber)}
            helperText={ !isValidCardNumber(formData.cardNumber) ? 'Número de tarjeta inválido' : '' } />
        </Stack>
        <Stack {...rowStackProps}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Fecha de Vencimiento" name="expireDate" value={formData.expireDate} views={['month', 'year']} onChange={(date) => handleDateChange("expireDate", date)} />
          </LocalizationProvider>
          <TextField required label="Moneda" name="coin" value={formData.coin} onChange={handleChange}
            error={!isValidCoin(formData.coin)}
            helperText={!isValidCoin(formData.coin) ? 'Moneda inválida' : ''} />
        </Stack>
        <Tabs value={value} onChange={handleTab} centered>
          <Tab label="Debito" />
          <Tab label="Credito" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Stack {...columnStackProps}>
            <Stack {...rowStackProps}>
              <TextField required label="Ingreso Monto Inicial" name="cash" value={formData.cash} onChange={handleChange}
                error={!isValidCash(formData.cash)}
                helperText={!isValidCash(formData.cash) ? 'Ingreso monto inválido' : ''} />
            </Stack>
            <Button variant="contained" type="submit" onClick={(e) => handleSubmitCard(e, 'debito')} disabled={!isDebitButtonEnabled()} > Regístrar Debito </Button>
          </Stack>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Stack {...columnStackProps}>
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
            <Button variant="contained" type="submit" onClick={(e) => handleSubmitCard(e, 'credito')} disabled={!isCreditButtonEnabled()} > Regístrar Credito </Button>
          </Stack>
        </TabPanel>
        <Button variant="outlined" onClick={onBack}>Atrás</Button>
      </Stack>
    </div>
  );
}
export default RegisterCard;