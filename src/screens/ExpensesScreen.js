import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import '../App.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

function ExpensesScreen({ onBack, onRegister }) {
  const userId = Cookies.get('userId')
  const [expenses, setExpenses] = useState([]);
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
  useEffect(() => {
    cargarGastos();
  }, []);
  const cargarGastos = async () => {
    try {
      const response = await axios.post('http://localhost:3000/obtener-gastos', { userId });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error al cargar gastos', error);
    }
  };

  function formatYearMonth(DateValue) {
    const date = new Date(DateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}`;
    return formattedDate;
  }

  return (
    <div className='whiteBoxRP'>
      <br />
      <IconButton color="primary" aria-label="back to login" onClick={() => onBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Stack {...columnStackProps}>
        <h2>Mis Gastos</h2>
        {expenses.length === 0 ? (
          <p>Aqui colocaria mi lista de gastos si tan solo tuviera una.</p>
        ) : (
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            <ul>
              <Stack direction="column" spacing={5}>
                {expenses.map((expense) => (
                  <li key={expense.id}>
                    <Card variant="outlined" sx={{ minWidth: 350 }}>
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Gasto #{expense.id} - {expense.type} {expense.type !== 'Debito'
                         && expense.installments && (<span>({expense.installments} Cuotas)</span>)} </Typography>
                        <Typography variant="h5" component="div"> {expense.mount} </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary"> {expense.category} - {expense.business} </Typography>
                      </CardContent>
                    </Card>
                    {console.log(expense)}
                    
                  
                  </li>
                ))}
              </Stack>
            </ul>

          </div>
        )}

        <Stack {...rowStackProps}>
          <Button variant="contained" onClick={() => { onRegister(); }} > Registrar Gasto </Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default ExpensesScreen;
