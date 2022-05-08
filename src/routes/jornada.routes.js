const express = require('express')
const jornadaController = require('../controllers/jornada.controller')

const md_auth = require('../middlewares/autenticacion')
const md_roles = require('../middlewares/roles')

const api = express.Router()

api.post('/agregarJornada/:idLiga', [md_auth.Auth, md_roles.verUsuario], jornadaController.crearJornada)
api.put('/agregarPartido/:jornadaId', [md_auth.Auth, md_roles.verUsuario], jornadaController.agregarPartido)
api.get('/verTablasPosiciones/:idLiga', [md_auth.Auth, md_roles.verUsuario], jornadaController.verTablaDePosiciones)
api.get('/reporte/:idLiga', [md_auth.Auth, md_roles.verUsuario], jornadaController.pdf)

module.exports = api;