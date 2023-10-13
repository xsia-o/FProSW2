import React from 'react';

function CardScreen({ onBack }) {
  return (
    <div>
      <h2>Mis Tarjetas</h2>
      <p>No se ha registrado ninguna tarjeta. Comienza agregando una!</p>
      <button>Agregar Tarjeta</button>
      <button>Modificar Tarjeta</button>
      <button>Eliminar Tarjeta</button>
      <button onClick={onBack}>Atrás</button>
    </div>
    
  );
}

export default CardScreen;