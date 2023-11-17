import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack, Button } from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import '../App.css';

function FrontPage() {
  const userId = Cookies.get('userId');                  // Se obtiene el UserId de las "Cookies"
  const [expenses, setExpenses] = useState([]);          // Data de los Gastos Encontrados
  const [filterDate, setFilterDate] = useState('total'); // Filtrado por Fecha

  useEffect(() => {
    cargarGastos();
    // eslint-disable-next-line
  }, []); //Se obtendra los gastos una vez se cargue la pagina

  const cargarGastos = async () => {
    try {
      const response = await axios.post('http://localhost:3000/obtener-gastos', { userId });
      let filteredExpenses = response.data;
      const today = new Date();
      if (filterDate === 'thisWeek') {                                 // Filtrado por "Esta Semana"
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= sevenDaysAgo && expenseDate <= today;
        });
      } else if (filterDate === 'thisMonth') {                         // Filtrado por "Este Mes"
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear()
          );
        });
      } else if (filterDate === 'thisYear') {
        filteredExpenses = filteredExpenses.filter((expense) => {      // Filtrado por "Este Año"
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === today.getFullYear();
        });
      }
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error al cargar gastos', error);
    }
  }; //Funcion para obtener los Gastos Filtrados del Usuario

  const procesarData = () => {
    const categories = ["Entretenimiento", "Educación", "Comida", "Transporte", "Otros"];
    const data = [0, 0, 0, 0, 0];
    expenses.forEach((expense) => {
      const categoryIndex = categories.indexOf(expense.category);
      if (categoryIndex !== -1) {
        data[categoryIndex] += parseFloat(expense.mount);
      }
    });
    return data;
  }; // Función para procesar los montos de Gastos para el PieChart
  const pieChartData = procesarData();

  //Código necesario para un correcto formato
  const formatDateDescription = (filterDate) => {
    const today = new Date();
    if (filterDate === 'thisWeek') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      return `Esta semana (${sevenDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()})`;
    } else if (filterDate === 'thisMonth') {
      return `Este mes (${new Intl.DateTimeFormat('es', { month: 'long' }).format(today)})`;
    } else if (filterDate === 'thisYear') {
      return `Este año (${today.getFullYear()})`;
    }
    return 'Total';
  };

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
      <Stack {...columnStackProps}>
        <h1>Oño????</h1>
        <Stack {...rowStackProps}> {/*Stack contenedor del select de Filtrado*/}
          <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
            <option value="total">Total</option>
            <option value="thisWeek">{formatDateDescription('thisWeek')}</option>
            <option value="thisMonth">{formatDateDescription('thisMonth')}</option>
            <option value="thisYear">{formatDateDescription('thisYear')}</option>
          </select>
          <Button variant="contained" size='small' onClick={cargarGastos}>Aplicar Filtros</Button>
        </Stack>
        <Stack {...rowStackProps}> {/*Stack contenedor del PieChart*/}
          <PieChart
            series={[
              {
                arcLabel: (item) => `$${item.value}`,
                arcLabelMinAngle: 45,
                data: [
                  { id: 0, value: pieChartData[0], label: 'Entretenimiento' },
                  { id: 1, value: pieChartData[1], label: 'Educación' },
                  { id: 2, value: pieChartData[2], label: 'Comida' },
                  { id: 3, value: pieChartData[3], label: 'Transporte' },
                  { id: 4, value: pieChartData[4], label: 'Otros' },
                ],
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: 'white',
                fontWeight: 'bold',
              },
            }}
            width={500}
            height={200}
          />
        </Stack>
      </Stack>
    </div>
  );
}

export default FrontPage;