const express = require("express");
require('dotenv').config();
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear el servidor de express
const app = express();

//Configurar CORS
app.use(cors());

//Run public folder for testing+++++++++++++++++
app.use(express.static('public'));

//Lectura de Body
app.use(express.json());

//Base de datos
dbConnection();

//Rutas

app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/upload', require('./routes/uploads'));





app.listen( process.env.PORT, () => {
    console.log('Server is running on port: ' + process.env.PORT);
});