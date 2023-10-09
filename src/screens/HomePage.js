import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div>
      <h1>Bienvenido a mi aplicación</h1>
      <button onClick={() => onNavigate()}>Comenzar</button>
    </div>
  );
}

export default HomePage;