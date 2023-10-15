import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NavBar from './NavBar'; 

function CardScreen({ onBack, onRegister }) {
  //Logica para obtener las Tarjetas
  const userId = Cookies.get('userId');
  const [debitCards, setDebitCards] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  useEffect(() => {
    axios.post('http://localhost:3000/obtener-debito', { userId })
      .then((response) => {
        setDebitCards(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener tarjetas de débito', error);
      });
    axios.post('http://localhost:3000/obtener-credito', { userId })
      .then((response) => {
        setCreditCards(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener tarjetas de crédito', error);
      });
  }, [userId]);

  //Logica para dar formato a Tarjetas
  function formatYearMonth(DateValue) {
    const date = new Date(DateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}`;
    return formattedDate;
  }
  function formatCardSeparation(StringValue) {
    const part1 = StringValue.substring(0, 4);
    const part2 = StringValue.substring(4, 8);
    const part3 = StringValue.substring(8, 12);
    const part4 = StringValue.substring(12, 16);
    const result = part1 + "   " + part2 + "   " + part3 + "   " + part4;
  
    return result;
  }
  /*function formatMonthDay(DateValue) {
    const date = new Date(DateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    return formattedDate;
  } No se usa por el momento*/ 

  return (
    <div>
      <NavBar />

      <Stack direction="column" justifyContent="center" alignItems="center" spacing={3}>
        <br />
        <h2>Mis Tarjetas</h2>

        {debitCards.length === 0 && creditCards.length === 0 ? (
          <p>No se ha registrado ninguna tarjeta. Comienza agregando una!</p>
        ) : (
          <>
          <ul>
            <Stack direction="row" alignItems="center" spacing={5}>
              {debitCards.map((debitCard) => (
                <li key={debitCard.id}>
                  <Card variant="outlined" sx={{ minWidth: 350 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Tarjeta Débito
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatCardSeparation(debitCard.cardnumber)}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Número de Tarjeta
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                          Fecha Exp.
                          <br />
                          {formatYearMonth(debitCard.expiredate)}
                        </Typography>
                        <Typography variant="body2">
                          Moneda.
                          <br />
                          {debitCard.coin}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button size="small">Modificar</Button>
                      <Button size="small">Eliminar</Button>
                    </CardActions>
                  </Card>
                </li>
              ))}
              </Stack>
            </ul>
            
            <ul>
              <Stack direction="row" alignItems="center" spacing={5}>
              {creditCards.map((creditCard) => (
                <li key={creditCard.id}>
                  <Card sx={{ minWidth: 350 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Tarjeta Crédito
                      </Typography>
                      <Typography variant="h5" component="div">
                        {formatCardSeparation(creditCard.cardnumber)}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Número de Tarjeta
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="body2">
                          Fecha Exp.
                          <br />
                          {formatYearMonth(creditCard.expiredate)}
                        </Typography>
                        <Typography variant="body2">
                          Moneda.
                          <br />
                          {creditCard.coin}
                        </Typography>
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button size="small">Modificar</Button>
                      <Button size="small">Eliminar</Button>
                    </CardActions>
                  </Card>
                </li>
              ))}
              </Stack>
            </ul>
            </>
        )}
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Button variant="outlined" onClick={() => onRegister()}>Agregar Tarjeta</Button>
        <Button variant="contained" onClick={onBack}>Atrás</Button> {/*Borrar luego de implementar el NavBar*/}
        </Stack>
      </Stack>
    </div>
  );
}
export default CardScreen;