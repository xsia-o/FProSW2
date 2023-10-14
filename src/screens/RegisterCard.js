import React, { useState } from 'react';
import { Credit, Debit } from '../classes/card'

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleDateChange = (name, date) => {
      setFormData({
        ...formData,
        [name]: date,
      });
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
            onChange={handleChange}
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
              />
              </Stack>
              <Button variant="contained" type="submit">
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