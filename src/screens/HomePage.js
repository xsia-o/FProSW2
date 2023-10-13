import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function HomePage({ onNavigate }) {
  return (
    <div>
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <h1>Bienvenido a FPro</h1>
      <Button variant="outlined" onClick={() => onNavigate()}>Comenzar</Button> 
      </Stack>
      
    </div>
  );
}

export default HomePage;