import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack, Button } from '@mui/material';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import '../App.css';

function FrontPage({ onMonthlyLimit }) {
  const userId = Cookies.get('userId');                   // Se obtiene el UserId de las "Cookies"
  const [expenses, setExpenses] = useState([]);           // Data de los Gastos Encontrados
  const [filterDate, setFilterDate] = useState('total');  // Filtrado por Fecha
  const [monthlyLimit, setMonthlyLimit] = useState('0');  // Data de Limite Mensual
  const [debitCards, setDebitCards] = useState([]);       // Data de las Tarjetas Debito Obtenidas
  const [creditCards, setCreditCards] = useState([]);     // Data de las Tarjetas Credito Obtenidas

  const handleRequestError = (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      console.error(error.response.data.error);
    } else {
      console.error("Error desconocido al actualizar la cuenta");
    }
  }; //Encargado de manejar los errores del servidor

  useEffect(() => {
    cargarGastos();
    cargarUsuario();
    cargarTarjetas();
    // eslint-disable-next-line
  }, []); //Se obtendra los gastos, usuario, y tarjetas una vez se cargue la pagina

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
      handleRequestError(error);
    }
  }; //Funcion para obtener los Gastos Filtrados del Usuario

  const cargarTarjetas = async () => {
    try {
      const responseDebit = await axios.post('http://localhost:3000/obtener-debito', { userId });
      const responseCredit = await axios.post('http://localhost:3000/obtener-credito', { userId });
      setDebitCards(responseDebit.data);
      setCreditCards(responseCredit.data);
    } catch (error) {
      handleRequestError(error);
    }
  }; //Función para obtener todas las tarjetas del usuario

  const cargarUsuario = async () => {
    let userId = Cookies.get('userId');
    if (userId) {
      axios.post('http://localhost:3000/obtener-cuenta', { userId })
        .then((response) => {
          const userData = response.data;
          setMonthlyLimit(userData.monthlylimit);
        })
        .catch((error) => {
          handleRequestError(error);
        });
    }
  }; //Función para obtener el limite mensual del usuario

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
  const totalAmount = pieChartData[0] + pieChartData[1] + pieChartData[2] + pieChartData[3] + pieChartData[4];

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
  const hasCardNearExpiration = () => {
    const today = new Date();
    const thresholdMonths = 1; // Umbral de meses para considerar que la fecha está cercana
    // Verificar tarjetas de débito
    const debitCardNearExpiration = debitCards.some(card => {
      const expirationDate = new Date(card.expiredate);
      const monthsDiff = (expirationDate.getFullYear() - today.getFullYear()) * 12 + expirationDate.getMonth() - today.getMonth();
      return monthsDiff <= thresholdMonths;
    });
    // Verificar tarjetas de crédito
    const creditCardNearExpiration = creditCards.some(card => {
      const expirationDate = new Date(card.expiredate);
      const monthsDiff = (expirationDate.getFullYear() - today.getFullYear()) * 12 + expirationDate.getMonth() - today.getMonth();
      return monthsDiff <= thresholdMonths;
    });
    // Devolver true si alguna tarjeta está cerca de la expiración
    return debitCardNearExpiration || creditCardNearExpiration;
  }; // Si se tiene alguna tarjeta con fecha de expiracion cercana

  const hasCreditCardNearPaymentDue = () => {
    const today = new Date();
    const thresholdDays = 14; // Umbral de días para considerar que la fecha está cercana

    return creditCards.some(card => {
      const paymentDueDate = new Date(card.lastdaypayment);
      const daysDiff = Math.floor((paymentDueDate - today) / (1000 * 60 * 60 * 24)); // Diferencia en días
      return daysDiff <= thresholdDays;
    });
  }; // Si se tiene alguna tarjeta con ultima fecha de pago cercana

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
        {monthlyLimit === 0 ? (
          <Stack {...rowStackProps}>
            <p>No se ha establecido un limite mensual. </p>
            <Button variant="contained" size='small' onClick={onMonthlyLimit}>Establece uno!</Button>
          </Stack>
        ) : (
          <>
            {totalAmount > monthlyLimit ? (
              <Stack {...rowStackProps}>
                <p>Se ha sobrepasado el limite mensual. (S/.{monthlyLimit})</p>
                <Button variant="contained" size='small' onClick={onMonthlyLimit}>Cambialo!</Button>
              </Stack>

            ) : (
              <Stack {...rowStackProps}>
                <p>No se ha sobrepasado el limite mensual. (S/.{monthlyLimit}) </p>
                <Button variant="contained" size='small' onClick={onMonthlyLimit}>Cambialo!</Button>
              </Stack>
            )}
          </>
        )}
        {expenses.length === 0 ? (
          <p>No se encontraron gastos</p>
        ) : (
          <div style={{ maxHeight: "500px", overflowY: "auto" }}> {/*Deslizante*/}
            <Stack {...columnStackProps}>
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
                      arcLabel: (item) => `S/.${item.value}`,
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
              <p>Monto Total: S/.{totalAmount}</p>
            </Stack>
          </div>
        )}

        {hasCardNearExpiration() && (
          <Stack {...rowStackProps}>
            <p>¡Atención! Alguna tarjeta tiene una fecha de expiración cercana.</p>
          </Stack>
        )}
        {hasCreditCardNearPaymentDue() && (
          <Stack {...rowStackProps}>
            <p>¡Atención! Alguna tarjeta de crédito tiene una fecha de pago próxima.</p>
          </Stack>
        )}

      </Stack>
    </div>
  );
}

export default FrontPage;