import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

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

  //Logica para dar formato a Fechas
  function formatYearMonth(DateValue) {
    const date = new Date(DateValue);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const formattedDate = `${year}-${month < 10 ? '0' : ''}${month}`;
    return formattedDate;
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
      <h2>Mis Tarjetas</h2>
      {debitCards.length === 0 && creditCards.length === 0 ? (
        <p>No se ha registrado ninguna tarjeta. Comienza agregando una.</p>
      ) : (
        <>
          <h3>Tarjetas de Débito:</h3>
          <ul>
            {debitCards.map((debitCard) => (
              <li key={debitCard.id}>
                {/* Mostrar las características de la tarjeta de débito */}
                Tarjeta: {debitCard.cardnumber}, Expira: {formatYearMonth(debitCard.expiredate)}, Moneda: {debitCard.coin}
              </li>
            ))}
          </ul>

          <h3>Tarjetas de Crédito:</h3>
          <ul>
            {creditCards.map((creditCard) => (
              
              <li key={creditCard.id}>
                {/* Mostrar las características de la tarjeta de crédito */}
                

                Tarjeta: {creditCard.cardnumber}, Expira: {formatYearMonth(creditCard.expiredate)}, Moneda: {creditCard.coin}
              </li>
            ))}
          </ul>
        </>
      )}
      <button onClick={() => onRegister()}>Agregar Tarjeta</button>
      <button>Modificar Tarjeta</button>
      <button>Eliminar Tarjeta</button>
      <button onClick={onBack}>Atrás</button>
    </div>
    
  );
}

export default CardScreen;
