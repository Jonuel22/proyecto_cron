const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: '1234', 
  port: 5432,
});

// Conectar a la base de datos
client.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch((err) => console.error('Error al conectar a PostgreSQL', err));

// Ruta para obtener todos los datos
app.get('/datos', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM datos');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener los datos:', err);
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// Ruta para insertar un nuevo dato
app.post('/datos', async (req, res) => {
  const { nombre, disponible } = req.body;

  if (!nombre || disponible === undefined) {
    return res.status(400).json({ error: 'Faltan parámetros' });
  }

  try {
    const result = await client.query(
      'INSERT INTO datos (nombre, disponible) VALUES ($1, $2) RETURNING *',
      [nombre, disponible]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al insertar el dato:', err);
    res.status(500).json({ error: 'Error al insertar el dato' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
