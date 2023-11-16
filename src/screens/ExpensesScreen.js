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
  const [filterType, setFilterType] = useState(''); // Tipo de gasto a filtrar
  const [filterCategory, setFilterCategory] = useState(''); // Categoría a filtrar
  const [sortBy, setSortBy] = useState(''); // Criterio de ordenamiento
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
    // eslint-disable-next-line
  }, []);
  const cargarGastos = async () => {
    try {
      const response = await axios.post('http://localhost:3000/obtener-gastos', { userId });

      let everyExpense = response.data;

      let filteredExpenses = everyExpense;

      // Filtrar por tipo
      if (filterType) {
        filteredExpenses = filteredExpenses.filter(expense => expense.type === filterType);
      }

      // Filtrar por categoría
      if (filterCategory) {
        filteredExpenses = filteredExpenses.filter(expense => expense.category === filterCategory);
      }

      // Ordenar
      if (sortBy === 'amount') {
        filteredExpenses.sort((a, b) => b.mount - a.mount); // Ordenar de mayor a menor monto
      } else if (sortBy === 'date') {
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha
      }

      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error al cargar gastos', error);
    }
  };
  const eliminarGasto = async (expenseId) => {
    try {
      await axios.post('http://localhost:3000/eliminar-gasto', { expenseId });
      cargarGastos();
    } catch (error) {
      console.error('Error al eliminar gasto', error);
    }
  };

  function formatYearMonth(DateValue) {
    const date = new Date(DateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
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
        <Stack direction="row" spacing={1}>
          <label>Tipo:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Todos</option>
            <option value="Debito">Débito</option>
            <option value="Credito">Crédito</option>
            {/* Agrega otras opciones según los tipos de gasto que manejes */}
          </select>
          <br />
          <label>Categoría:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Todas</option>
            <option value="Comida">Comida</option>
            <option value="Transporte">Transporte</option>
            {/* Agrega otras opciones según las categorías de gasto que manejes */}
          </select>
          <br />
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Ninguno</option>
            <option value="amount">Monto</option>
            <option value="date">Fecha</option>
          </select>
          <br />
          <Button variant="contained" size='small' onClick={cargarGastos}>Aplicar Filtros</Button>
          </Stack>
        {expenses.length === 0 ? (
          <p>No se encontraron gastos</p>
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
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Fecha: {formatYearMonth(expense.date)} </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}>
                        <Button size="small" onClick={() => eliminarGasto(expense.id)} >Eliminar</Button>
                      </CardActions>
                    </Card>
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
