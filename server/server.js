const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:285600@localhost:5432/postgres'); // Cambia con tus propios detalles de conexión
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/guardar-usuarios', async (req, res) => {
  try {
    const { fname, lname, email, phone, password} = req.body;
    await db.none('INSERT INTO users (fname, lname, email, phone, password) VALUES ($1, $2, $3, $4, $5)', [fname, lname, email, phone, password]);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
