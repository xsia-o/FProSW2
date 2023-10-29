import React, { useEffect, useState } from 'react';
import {
  Cookies,
  axios,
  Stack,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography
} from './abbr-lib'

function CardScreen({ onBack, onRegister, onDebitModify, onCreditModify }) {
  //Logica para obtener las Tarjetas
  const userId = Cookies.get('userId');
  const [debitCards, setDebitCards] = useState([]);
  const [creditCards, setCreditCards] = useState([]);
  useEffect(() => {
    cargarTarjetas();
  });
  const cargarTarjetas = async () => {
    try {
      const responseDebit = await axios.post('http://localhost:3000/obtener-debito', { userId });
      const responseCredit = await axios.post('http://localhost:3000/obtener-credito', { userId });
      setDebitCards(responseDebit.data);
      setCreditCards(responseCredit.data);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
    }
  };
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
  // Logica para eliminar tarjetas
  const eliminarTarjetaDebito = async (debitCardId) => {
    try {
      await axios.post('http://localhost:3000/eliminar-debito', { debitCardId });
      cargarTarjetas();
    } catch (error) {
      console.error('Error al eliminar tarjeta de débito:', error);
    }
  };
  const eliminarTarjetaCredito = async (creditCardId) => {
    try {
      await axios.post('http://localhost:3000/eliminar-credito', { creditCardId });
      cargarTarjetas();
    } catch (error) {
      console.error('Error al eliminar tarjeta de crédito:', error);
    }
  };
  return (
    <div>
      <Stack className="whiteBoxCS" direction="column" justifyContent="center" alignItems="center" spacing={3}>
        <br />
        <h2>Mis Tarjetas</h2>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {/*Se verifica si se tiene Tarjetas*/}
          {debitCards.length === 0 && creditCards.length === 0 ? (
            <p>No se ha registrado ninguna tarjeta. Comienza agregando una!</p>
          ) : (
            <>
              <ul>
                {/*Lista de Tarjetas Debito*/}
                <Stack direction="column" alignItems="center" spacing={5}>
                  {debitCards.map((debitCard) => (
                    <li key={debitCard.id}>
                      <Card variant="outlined" sx={{ minWidth: 350 }}>
                        <CardContent>
                          {/*Numero de Tarjeta*/}
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Tarjeta Débito </Typography>
                          <Typography variant="h5" component="div">{formatCardSeparation(debitCard.cardnumber)}</Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary"> Número de Tarjeta </Typography>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/*Datos*/}
                            <Typography variant="body2"> Fecha Exp. <br /> {formatYearMonth(debitCard.expiredate)} </Typography>
                            <Typography variant="body2"> Moneda. <br /> {debitCard.coin} </Typography>
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between' }}>
                          {/*Acciones*/}
                          <Button size="small" onClick={() => { Cookies.set('debitCardId', debitCard.id); onDebitModify(); }}> Modificar </Button>
                          <Button size="small" onClick={() => eliminarTarjetaDebito(debitCard.id)} >Eliminar</Button>
                        </CardActions>
                      </Card>
                    </li>
                  ))}
                </Stack>
              </ul>
              <ul>
                {/*Lista de Tarjetas Credito*/}
                <Stack direction="row" alignItems="center" spacing={5}>
                  {creditCards.map((creditCard) => (
                    <li key={creditCard.id}>
                      <Card variant="outlined" sx={{ minWidth: 350 }}>
                        <CardContent>
                          {/*Numero de Tarjeta*/}
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Tarjeta Crédito </Typography>
                          <Typography variant="h5" component="div"> {formatCardSeparation(creditCard.cardnumber)} </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary"> Número de Tarjeta </Typography>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            {/*Datos*/}
                            <Typography variant="body2"> Fecha Exp. <br /> {formatYearMonth(creditCard.expiredate)} </Typography>
                            <Typography variant="body2"> Moneda. <br /> {creditCard.coin} </Typography>
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'space-between' }}>
                          {/*Acciones*/}
                          <Button size="small" onClick={() => { Cookies.set('creditCardId', creditCard.id); onCreditModify(); }}> Modificar </Button>
                          <Button size="small" onClick={() => eliminarTarjetaCredito(creditCard.id)} >Eliminar</Button>
                        </CardActions>
                      </Card>
                    </li>
                  ))}
                </Stack>
              </ul>
            </>
          )}
        </div>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Button variant="outlined" onClick={() => onRegister()}>Agregar Tarjeta</Button>
        </Stack>
      </Stack>
    </div>
  );
}
export default CardScreen;