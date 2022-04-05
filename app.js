//Importaciones
const express = require('express');
const cors = require('cors');
var app = express();

// importacion de rutas


//MIDDLEWARES

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Cabeceras

app.use(cors());


//Carga de rutas

//app.use('/api',);


//Exportaciones

module.exports = app;