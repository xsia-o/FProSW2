import React from 'react';
import '../App.css';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

function ExpensesScreen({ onBack, onRegister }) {
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
    <div className='whiteBoxRP'>
      <br />
      <IconButton color="primary" aria-label="back to login" onClick={() => onBack()}>
        <ArrowBackIcon />
      </IconButton>
      <Stack {...columnStackProps}>
        <h2>Mis Gastos</h2>
        <p>Aqui colocaria mi lista de gastos si tan solo tuviera una.</p>
        <Stack {...rowStackProps}>
          <Button variant="contained" onClick={() => { onRegister(); }} > Registrar Gasto </Button>
        </Stack>
      </Stack>
    </div>
  );
}

export default ExpensesScreen;
