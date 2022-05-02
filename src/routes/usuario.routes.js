const express = require('express')
const usuarioController = require('../controllers/usuario.controller')

//Middleware

const md_auth = require('../middlewares/autenticacion')
const md_roles = require('../middlewares/roles')

const api = express.Router()

//rutas
api.post('/registrar', usuarioController.registrarUsuario)
api.post('/login', usuarioController.login)

//Exportaciones
module.exports = api