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
    if (await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email])) {
      res.status(401).json({ message: 'Correo ya registrado' });
    } else {
      await db.none('INSERT INTO users (fname, lname, dni, age, email, phone, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fname, lname, dni, age, email, phone, username, password]);
      res.status(201).json({ message: 'Datos almacenados con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los datos en la base de datos' });
  }
});
app.post('/iniciar-sesion', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);

  if (user) {
    res.status(200).json({ message: 'Inicio de sesión exitoso', userId: user.id });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});
app.post('/guardar-debito', async (req, res) => {
  try {
    const { cardNumber, accountNumber, expireDate, coin, minimum} = req.body;
    await db.none('INSERT INTO debit (cardNumber, accountNumber, expireDate, coin, minimum) VALUES ($1, $2, $3, $4, $5)', [cardNumber, accountNumber, expireDate, coin, minimum]);
    res.status(201).json({ message: 'Datos almacenados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los datos en la base de datos' });
  }
});
app.post('/guardar-credito', async (req, res) => {
  try {
    const { cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment} = req.body;
    await db.none('INSERT INTO credit (cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment]);
    res.status(201).json({ message: 'Datos almacenados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los datos en la base de datos' });
  }
});
app.post('/obtener-debito', async (req, res) => {
  try {
    const { userId } = req.body;
    const debitCards = await db.manyOrNone('SELECT * FROM debit WHERE accountNumber = $1', [userId]);
    res.status(200).json(debitCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tarjetas de débito' });
  }
});
app.post('/obtener-credito', async (req, res) => {
  try {
    const { userId } = req.body;
    const creditCards = await db.manyOrNone('SELECT * FROM credit WHERE accountNumber = $1', [userId]);
    res.status(200).json(creditCards);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tarjetas de crédito' });
  }
});

app.post('/eliminar-debito', async (req, res) => {
  try {
    const { debitCardId } = req.body;
    await db.none('DELETE FROM debit WHERE id = $1', [debitCardId]);
    res.status(200).json({ message: 'Tarjeta de débito eliminada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tarjeta de débito' });
  }
});

app.post('/eliminar-credito', async (req, res) => {
  try {
    const { creditCardId } = req.body;
    await db.none('DELETE FROM credit WHERE id = $1', [creditCardId]);
    res.status(200).json({ message: 'Tarjeta de crédito eliminada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tarjeta de crédito' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
