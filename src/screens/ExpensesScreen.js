import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack, Button, Typography, IconButton, Card, CardActions, CardContent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../App.css';

function ExpensesScreen({ onBack, onRegister }) {
  const userId = Cookies.get('userId')                      // Se obtiene el UserId de las "Cookies"
  const [expenses, setExpenses] = useState([]);             // Data de los Gastos Encontrados
  const [filterType, setFilterType] = useState('');         // Tipo de gasto a filtrar
  const [filterCategory, setFilterCategory] = useState(''); // Categoría a filtrar
  const [sortBy, setSortBy] = useState('');                 // Criterio de ordenamiento

  useEffect(() => {
    cargarGastos();
    // eslint-disable-next-line
  }, []); //Se obtendra los gastos una vez se cargue la pagina

  const cargarGastos = async () => {
    try {
      const response = await axios.post('http://localhost:3000/obtener-gastos', { userId });
      let filteredExpenses = response.data;
      if (filterType) { // Filtrar por tipo
        filteredExpenses = filteredExpenses.filter(expense => expense.type === filterType);
      }
      if (filterCategory) { // Filtrar por categoría
        filteredExpenses = filteredExpenses.filter(expense => expense.category === filterCategory);
      }
      if (sortBy === 'amount') {
        filteredExpenses.sort((a, b) => b.mount - a.mount); // Ordenar de mayor a menor monto
      } else if (sortBy === 'date') {
        filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha
      }
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error al cargar gastos', error);
    }
  }; //Funcion para obtener los Gastos Filtrados del Usuario

  const eliminarGasto = async (expenseId) => {
    try {
      await axios.post('http://localhost:3000/eliminar-gasto', { expenseId });
      cargarGastos();
    } catch (error) {
      console.error('Error al eliminar gasto', error);
    }
  }; //Funcion para eliminar los Gastos del Usuario, tanto Pagos Únicos, como Cuotas

  //Código necesario para un correcto formato
  function formatYearMonth(DateValue) {
    const date = new Date(DateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
  }

  //Propiedades comunes de la página
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
  
  return (
    <div className='whiteBoxRP'> {/*Caja Blanca*/}
      <br />
      <IconButton color="primary" aria-label="Back to FrontPage" onClick={() => onBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Stack {...columnStackProps}> 
        <h2>Mis Gastos</h2>
        <Stack {...rowStackProps}> {/*Stack contenedor de selects de Filtrado*/}
          <label>Tipo:</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Todos</option>
            <option value="Debito">Débito</option>
            <option value="Credito">Crédito</option>
          </select>
          <br />
          <label>Categoría:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Todas</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Educacion">Educacion</option>
            <option value="Comida">Comida</option>
            <option value="Transporte">Transporte</option>
            <option value="Otros">Otros</option>
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
        {/*(Abajo) Si la cantidad de gastos es 0, devuelve texto. Sino, el resto.*/}
        {expenses.length === 0 ? (
          <p>No se encontraron gastos</p>
        ) : (
          <div style={{ maxHeight: "500px", overflowY: "auto" }}> {/*Deslizante*/}
            <ul>
              <Stack {...rowStackProps}>
                {expenses.map((expense) => (
                  <li key={expense.id}>
                    <Card variant="outlined" sx={{ minWidth: 350 }}> {/*Elemento de lista de Gastos*/}
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Gasto #{expense.id} - {expense.type} {expense.type !== 'Debito'
                          && expense.installments && (<span>({expense.installments} Cuotas)</span>)} </Typography>
                        <Typography variant="h5" component="div"> {expense.mount} </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary"> {expense.category} - {expense.business} </Typography>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Fecha: {formatYearMonth(expense.date)} </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}> {/*Acciones respectivas al Gasto*/}
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
          <Button variant="contained" onClick={() => onRegister()}>Registrar Gasto</Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default ExpensesScreen;