const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:285600@localhost:5432/postgres');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/guardar-usuarios', async (req, res) => {
  try {
    const { fname, lname, dni, age, email, phone, username, password } = req.body;
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
    const { cardNumber, accountNumber, expireDate, coin, cash } = req.body;
    await db.none('INSERT INTO debit (cardNumber, accountNumber, expireDate, coin, cash) VALUES ($1, $2, $3, $4, $5)', [cardNumber, accountNumber, expireDate, coin, cash]);
    res.status(201).json({ message: 'Datos almacenados con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar los datos en la base de datos' });
  }
});
app.post('/guardar-credito', async (req, res) => {
  try {
    const { cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment, creditCash, insurance } = req.body;
        await db.none('INSERT INTO credit (cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment, creditCash, insurance) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'
    , [cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment, creditCash, insurance]);

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
    const debitCardsWithType = debitCards.map(card => ({ ...card, type: 'Debito' }));
    res.status(200).json(debitCardsWithType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener tarjetas de débito' });
  }
});
app.post('/obtener-credito', async (req, res) => {
  try {
    const { userId } = req.body;
    const creditCards = await db.manyOrNone('SELECT * FROM credit WHERE accountNumber = $1', [userId]);
    const creditCardsWithType = creditCards.map(card => ({ ...card, type: 'Credito' }));
    res.status(200).json(creditCardsWithType);

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

app.post('/obtener-debito-por-id', async (req, res) => {
  try {
    const { debitCardId } = req.body;
    const debitCard = await db.oneOrNone('SELECT * FROM debit WHERE id = $1', [debitCardId]);
    if (debitCard) {
      res.status(200).json(debitCard);
    } else {
      res.status(404).json({ error: 'Tarjeta de débito no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la tarjeta de débito por ID' });
  }
});
app.post('/actualizar-debito', async (req, res) => {
  try {
    const { debitCardId, cardNumber, accountNumber, expireDate, coin } = req.body;
    await db.none('UPDATE debit SET cardNumber = $1, accountNumber = $2, expireDate = $3, coin = $4 WHERE id = $5',
      [cardNumber, accountNumber, expireDate, coin, debitCardId]);
    res.status(200).json({ message: 'Tarjeta de débito actualizada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la tarjeta de débito' });
  }
});
app.post('/obtener-credito-por-id', async (req, res) => {
  try {
    const { creditCardId } = req.body;
    const creditCard = await db.oneOrNone('SELECT * FROM credit WHERE id = $1', [creditCardId]);
    if (creditCard) {
      res.status(200).json(creditCard);
    } else {
      res.status(404).json({ error: 'Tarjeta de crédito no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la tarjeta de crédito por ID' });
  }
});
app.post('/actualizar-credito', async (req, res) => {
  try {
    const { creditCardId, cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment, insurance } = req.body;
    await db.none('UPDATE credit SET cardNumber = $1, accountNumber = $2, expireDate = $3, coin = $4, billingDate = $5, interestRate = $6, creditLine = $7, lastDayPayment = $8, insurance = $9 WHERE id = $10',
      [cardNumber, accountNumber, expireDate, coin, billingDate, interestRate, creditLine, lastDayPayment, insurance, creditCardId]);
    res.status(200).json({ message: 'Tarjeta de crédito actualizada con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la tarjeta de crédito' });
  }
});
app.post('/obtener-cuenta', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'Cuenta no encontrada' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la cuenta por ID' });
  }
});
app.post('/actualizar-cuenta', async (req, res) => {
  try {
    const { userId, fname, lname, email, phone, username, password, dni, age } = req.body;
    const valid = await db.oneOrNone('SELECT * FROM users WHERE id = $1 AND password = $2', [userId, password]);
    if (valid) {
      await db.none('UPDATE users SET fname = $1, lname = $2, email = $3, phone = $4, username = $5, password = $6, dni = $7, age = $8 WHERE id = $9',
        [fname, lname, email, phone, username, password, dni, age, userId]);
      res.status(200).json({ message: 'Cuenta actualizada con éxito' });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la cuenta' });
  }
});
app.post('/actualizar-contrasena', async (req, res) => {
  try {
    const { userId, password, newPass, newPassVali } = req.body;
    const valid = await db.oneOrNone('SELECT * FROM users WHERE id = $1 AND password = $2', [userId, password]);
    if (valid) {
      if (newPass === newPassVali) {
        await db.none('UPDATE users SET password = $1 WHERE id = $2',
          [newPass, userId]);
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
      } else {
        res.status(401).json({ error: 'Validacion incorrecta' });
      }
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cuenta' });
  }
});
app.post('/eliminar-cuenta', async (req, res) => {
  try {
    const { userId, password } = req.body;
    const valid = await db.oneOrNone('SELECT * FROM users WHERE id = $1 AND password = $2', [userId, password]);
    if (valid) {
      await db.none('DELETE FROM users WHERE id = $1', [userId]);
      res.status(200).json({ message: 'Tarjeta de crédito eliminada con éxito' });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la tarjeta de crédito' });
  }
});
app.post('/actualizar-cash', async (req, res) => {
  try {
    const { debitCardId, income } = req.body;
    const currentCashResult = await db.one('SELECT cash FROM debit WHERE id = $1', debitCardId);
    const currentCash = parseFloat(currentCashResult.cash);
    const newCash = currentCash + parseFloat(income);
    await db.none('UPDATE debit SET cash = $1 WHERE id = $2', [newCash, debitCardId]);
    res.status(200).json({ message: 'Cash actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el cash de la tarjeta de débito' });
  }
});
app.post('/guardar-gasto', async (req, res) => {
  try {
    const { cardid, userid, mount, category, business, date, type, installments } = req.body;
    await db.none('INSERT INTO expenses (cardid, userid, mount, category, business, date, type, installments) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [cardid, userid, mount, category, business, date, type, installments]);
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
