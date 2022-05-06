const express = require('express')
const ligasController = require('../controllers/ligas.controller')

//Middleware

const md_auth = require('../middlewares/autenticacion')
const md_roles = require('../middlewares/roles')

const api = express.Router()

//rutas

api.post('/crearLiga/:idUsuario?', md_auth.Auth, ligasController.crearLiga)
api.get('/verLigas/:idUsuario?', md_auth.Auth, ligasController.verLigas)
api.put('/editarLiga/:idLiga', [md_auth.Auth, md_roles.verUsuario], ligasController.editarLigas)

//Importacion
module.exports = api;