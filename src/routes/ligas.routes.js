const express = require('express')
const ligasController = require('../controllers/ligas.controller')

//Middleware

const md_auth = require('../middlewares/autenticacion')
const md_roles = require('../middlewares/roles')

const api = express.Router()

//rutas

//Importacion
module.exports = api;