//Importaciones
const express = require('express');
const cors = require('cors');
var app = express();

// importacion de rutas

const usuarioRutas = require('./src/routes/usuario.routes')
const ligasRutas = require('./src/routes/ligas.routes')

//MIDDLEWARES

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras

app.use(cors());


//Carga de rutas

app.use('/api', usuarioRutas);


//Exportaciones

module.exports = app;