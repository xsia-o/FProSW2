import React from 'react';

function ExpensesScreen({ onBack }) {
  return (
    <div>
      <h2>Mis Gastos</h2>
      <ul>
        <li>Gasto 1</li>
        <li>Gasto 2</li>
        <li>Gasto 3</li>
      </ul>
      <div>
        <button>Filtrar Ascendente</button>
        <button>Filtrar Descendente</button>
        <button>Filtrar por Rubro</button>
      </div>
      <div>
      <button>Agregar Gasto</button> 
      <button>Eliminar Gasto</button>
      </div>
      <button onClick={onBack}>Atrás</button>
    </div>
  );
}

export default ExpensesScreen;
