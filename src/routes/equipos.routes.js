const express = require('express')
const equiposController = require('../controllers/equipos.controller')

const md_auth = require('../middlewares/autenticacion')
const md_roles = require('../middlewares/roles')

const api = express.Router()

//rutas

api.post('/crearEquipo/:idUsuario?', md_auth.Auth, equiposController.crearEquipo)
api.get('/verEquipos/:idUsuario?', md_auth.Auth, equiposController.verTodosEquipos)

module.exports = api;