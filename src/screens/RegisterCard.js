import React, { useState } from 'react';
import { Credit, Debit } from '../classes/card';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
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
  const [value, setValue] = React.useState(0);
  const [debitFormComplete, setDebitFormComplete] = useState(false);
  const [creditFormComplete, setCreditFormComplete] = useState(false);

  const [formData, setFormData] = useState({
    cardNumber: '',
    accountNumber: '',
    expireDate: null,
    coin: '',
    minimum: '',
    billingDate: null,
    interestRate: '',
    creditLine: '',
    lastDayPayment: null,
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    const requiredFields = ['cardNumber', 'coin'];

    if (requiredFields.every((field) => formData[field] !== '') && formData.expireDate !== null) {
      setDebitFormComplete(true);
    } else {
      setDebitFormComplete(false);
    }

    if (requiredFields.every((field) => formData[field] !== '') && formData.billingDate !== null && formData.interestRate !== '' && formData.creditLine !== '' && formData.lastDayPayment !== null) {
      setCreditFormComplete(true);
    } else {
      setCreditFormComplete(false);
    }
  };

  const handleTab = (event, newValue) => {
    setValue(newValue);
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
            onChange={(e) => handleChange('cardNumber', e.target.value)}
          />
        </Stack>

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              required
              label="Fecha de Vencimiento"
              name="expireDate"
              value={formData.expireDate}
              onChange={(date) => handleChange('expireDate', date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <TextField
            required
            id="outlined-required"
            label="Moneda"
            name="coin"
            value={formData.coin}
            onChange={(e) => handleChange('coin', e.target.value)}
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
                onChange={(e) => handleChange('minimum', e.target.value)}
              />
            </Stack>
            <Button variant="contained" type="submit" disabled={!debitFormComplete}>
              Regístrar Debito
            </Button>
          </Stack>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  required
                  label="Fecha de Facturacion"
                  name="billingDate"
                  value={formData.billingDate}
                  onChange={(date) => handleChange('billingDate', date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>

              <TextField
                required
                id="outlined-required"
                label="Tasa de Interes"
                name="interestRate"
                value={formData.interestRate}
                onChange={(e) => handleChange('interestRate', e.target.value)}
              />
            </Stack>

            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
              <TextField
                required
                id="outlined-required"
                label="Linea de Credito"
                name="creditLine"
                value={formData.creditLine}
                onChange={(e) => handleChange('creditLine', e.target.value)}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  required
                  label="Ultimo Dia de Pago"
                  name="lastDayPayment"
                  value={formData.lastDayPayment}
                  onChange={(date) => handleChange('lastDayPayment', date)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Stack>

            <Button variant="contained" type="submit" disabled={!creditFormComplete}>
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
