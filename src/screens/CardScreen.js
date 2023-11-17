import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Stack, Card, CardActions, CardContent, Button, Typography, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import '../App.css';

function CardScreen({ onBack, onRegister, onIncome, onDebitModify, onCreditModify }) {
  const userId = Cookies.get('userId');                 //Se obtiene el UserId de las "Cookies"
  const [debitCards, setDebitCards] = useState([]);     //Data de las Tarjetas Debito Obtenidas
  const [creditCards, setCreditCards] = useState([]);   //Data de las Tarjetas Credito Obtenidas

  useEffect(() => {
    cargarTarjetas();
  }); //Se obtendran las tarjetas una vez se cargue la pagina

  const cargarTarjetas = async () => {
    try {
      const responseDebit = await axios.post('http://localhost:3000/obtener-debito', { userId });
      const responseCredit = await axios.post('http://localhost:3000/obtener-credito', { userId });
      setDebitCards(responseDebit.data);
      setCreditCards(responseCredit.data);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
    }
  }; //Función para obtener todas las tarjetas del usuario

  const eliminarTarjeta = async (cardId, tipoTarjeta) => {
    try {
      if (tipoTarjeta === 'debito') {
        await axios.post('http://localhost:3000/eliminar-debito', { debitCardId: cardId });
      } else if (tipoTarjeta === 'credito') {
        await axios.post('http://localhost:3000/eliminar-credito', { creditCardId: cardId });
      }
      cargarTarjetas();
    } catch (error) {
      console.error(`Error al eliminar tarjeta de ${tipoTarjeta}:`, error);
    }
  }; //Funcion para poder eliminar la tarjeta

  //Código necesario para un correcto formato
  function formatYearMonth(DateValue) {
    const date = new Date(DateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}`;
    return formattedDate;
  }
  function formatCardSeparation(StringValue) {
    const part1 = StringValue.substring(0, 3);
    const lastpart = StringValue.substring(13, 16);
    const result = part1 + "*   ****    ****   *" + lastpart;
    return result;
  }
  
  //Propiedades comunes de la página
  const stackProps = {
    justifyContent: "center",
    alignItems: "center",
    spacing: 2,
  }
  const rowStackProps = {
    direction: "row",
    ...stackProps,
  };
  const columnStackProps = {
    direction: "column",
    ...stackProps,
  };

  return (
    <div className="whiteBoxCS"> {/*Caja Blanca*/}
      <br />
      <IconButton color="primary" aria-label="back to login" onClick={() => onBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Stack {...columnStackProps}>
        <h2>Mis Tarjetas</h2>
        {/*(Abajo) Si la cantidad de tarjetas Debito o Credito es 0, devuelve texto. Sino, el resto.*/}
        {debitCards.length === 0 && creditCards.length === 0 ? (
          <p>No se ha registrado ninguna tarjeta. Comienza agregando una!</p>
        ) : (
          <div style={{ maxHeight: "650px", overflowY: "auto" }}> {/*Deslizante*/}
            <ul>
              <Stack {...rowStackProps}> {/*Stack contenedor de lista de Tarjetas Debito*/}
                {debitCards.map((debitCard) => (
                  <li key={debitCard.id}>
                    <Card variant="outlined" sx={{ minWidth: 350 }}> {/*Elemento de lista de Tarjetas Debito*/}
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Tarjeta Débito </Typography>
                        <Typography variant="h5" component="div"> {formatCardSeparation(debitCard.cardnumber)} </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary"> Número de Tarjeta </Typography>
                        <Stack {...rowStackProps}>
                          <Typography variant="body2"> Fecha Exp <br /> {formatYearMonth(debitCard.expiredate)} </Typography>
                          <Typography variant="body2"> Moneda <br /> {debitCard.coin} </Typography>
                          <Typography variant="body2"> Disponible <br /> {debitCard.cash} </Typography>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}> {/*Acciones respectivas a la Tarjeta Debito*/}
                        <Button size="small" onClick={() => { Cookies.set('debitCardId', debitCard.id); onDebitModify(); }} > Modificar </Button>
                        <Button size="small" onClick={() => { Cookies.set('debitCardId', debitCard.id); onIncome(); }}> + </Button>
                        <Button size="small" onClick={() => eliminarTarjeta(debitCard.id, 'debito')} >Eliminar</Button>
                      </CardActions>
                    </Card>
                  </li>
                ))}
              </Stack>
            </ul>
            <ul>
              <Stack {...rowStackProps}> {/*Stack contenedor de lista de Tarjetas Credito*/}
                {creditCards.map((creditCard) => (
                  <li key={creditCard.id}>
                    <Card variant="outlined" sx={{ minWidth: 350 }}> {/*Elemento de lista de Tarjetas Credito*/}
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom> Tarjeta Crédito </Typography>
                        <Typography variant="h5" component="div"> {formatCardSeparation(creditCard.cardnumber)} </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary"> Número de Tarjeta </Typography>
                        <Stack {...rowStackProps}>
                          <Typography variant="body2"> Fecha Exp <br /> {formatYearMonth(creditCard.expiredate)} </Typography>
                          <Typography variant="body2"> Moneda <br /> {creditCard.coin} </Typography>
                          <Typography variant="body2"> Linea Cr <br /> {creditCard.creditline} </Typography>
                          <Typography variant="body2"> Disponible <br /> {creditCard.creditcash} </Typography>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between' }}> {/*Acciones respectivas a la Tarjeta Credito*/}
                        <Button size="small" onClick={() => { Cookies.set('creditCardId', creditCard.id); onCreditModify(); }} > Modificar </Button>
                        <Button size="small" onClick={() => eliminarTarjeta(creditCard.id, 'credito')} >Eliminar</Button>
                      </CardActions>
                    </Card>
                  </li>
                ))}
              </Stack>
            </ul>
          </div>
        )}
        <Stack {...rowStackProps}>
          <Button variant="outlined" onClick={() => onRegister()}>Agregar Tarjeta</Button>
        </Stack>
      </Stack>
    </div>
  );
}
export default CardScreen;