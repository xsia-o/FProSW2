const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:285600@localhost:5432/postgres'); 
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/guardar-usuarios', async (req, res) => {
  try {
    const { fname, lname, dni, age, email, phone, username, password} = req.body;
    await db.none('INSERT INTO users (fname, lname, dni, age, email, phone, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fname, lname, dni, age, email, phone, username, password]);

    res.status(201).json({ message: 'Datos almacenados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los datos en la base de datos' });
  }
});
app.post('/iniciar-sesion', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

  if (user) {
    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});
app.post('/guardar-debito', async (req, res) => {
  try {
    const { cardNumber, accountNumber, expireDate, coin, minimum} = req.body;
    await db.none('INSERT INTO debito (cardNumber, accountNumber, expireDate, coin, minimum) VALUES ($1, $2, $3, $4, $5)', [cardNumber, accountNumber, expireDate, coin, minimum]);
    res.status(201).json({ message: 'Datos almacenados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los datos en la base de datos' });
  }
});
app.post('/guardar-credito', async (req, res) => {
  try {
    const { cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment} = req.body;
    await db.none('INSERT INTO debito (cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment]);
    res.status(201).json({ message: 'Datos almacenados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los datos en la base de datos' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
