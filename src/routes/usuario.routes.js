const express = require('express')
const usuarioController = require('../controllers/usuario.controller')

//Middleware

const md_auth = require('../middlewares/autenticacion')
const md_roles = require('../middlewares/roles')

const app = express.Router()

//rutas



//Exportaciones
module.exports = app