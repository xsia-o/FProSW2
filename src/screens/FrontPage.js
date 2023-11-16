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
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';

function FrontPage() {
  const userId = Cookies.get('userId')
  const [expenses, setExpenses] = useState([]);
  const [filterDate, setFilterDate] = useState('total');
  useEffect(() => {
    cargarGastos();
    // eslint-disable-next-line
  }, []);

  const cargarGastos = async () => {
    try {
      const response = await axios.post('http://localhost:3000/obtener-gastos', { userId });

      let everyExpense = response.data;
      let filteredExpenses = everyExpense;
      const today = new Date();
      if (filterDate === 'thisWeek') {
        const sevenDaysAgo = new Date(today); 
        sevenDaysAgo.setDate(today.getDate() - 7);

        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= sevenDaysAgo && expenseDate <= today;
        });
      } else if (filterDate === 'thisMonth') {
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === today.getMonth() && expenseDate.getFullYear() === today.getFullYear()
          );
        });
      } else if (filterDate === 'thisYear') {
        filteredExpenses = filteredExpenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === today.getFullYear();
        });
      }

      setExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error al cargar gastos', error);
    }
  };


  // Función para procesar los datos de gastos para el PieChart
  const procesarData = () => {
    const categories = ["Entretenimiento", "Educación", "Comida", "Transporte", "Otros"];
    const data = [0, 0, 0, 0, 0];
    // Suma los gastos por categoría
    expenses.forEach((expense) => {

      const categoryIndex = categories.indexOf(expense.category);
      if (categoryIndex !== -1) {

        data[categoryIndex] += parseFloat(expense.mount);
      }
    });
    return data;
  };
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


  const pieChartData = procesarData();

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
  const categories = ["Entretenimiento", "Educación", "Comida", "Transporte", "Otros"];
  return (
    <div className='whiteBoxRP' >
      <br />
      <Stack {...columnStackProps}>
        <h1>Oño????</h1>

        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        >
          <option value="total">Total</option>
          <option value="thisWeek">{formatDateDescription('thisWeek')}</option>
          <option value="thisMonth">{formatDateDescription('thisMonth')}</option>
          <option value="thisYear">{formatDateDescription('thisYear')}</option>
        </select>
        <Button variant="contained" size='small' onClick={cargarGastos}>Aplicar Filtros</Button>
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


    </div>
  );
}

export default FrontPage;
