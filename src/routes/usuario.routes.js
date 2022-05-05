const express = require('express')
const usuarioController = require('../controllers/usuario.controller')

//Middleware

const md_auth = require('../middlewares/autenticacion')
const md_roles = require('../middlewares/roles')

const api = express.Router()

//rutas
api.post('/registrar', usuarioController.registrarUsuario)
api.post('/login', usuarioController.login)
api.post('/registrarAdmin', [md_auth.Auth, md_roles.verAdministrador] ,usuarioController.registrarUsuarioAdmin)
api.put('/editarUsuario/:idUser?', md_auth.Auth, usuarioController.editarUsuario)
api.delete('/eliminarUsuario/:idUser', [md_auth.Auth, md_roles.verAdministrador], usuarioController.eliminarUsuarios)
api.get('/verUsuarios', [md_auth.Auth, md_roles.verAdministrador], usuarioController.verUsuarios)

//Torneos
api.post('/crearTorneo', [md_auth.Auth, md_roles.verAdministrador], usuarioController.crearTorneo)
api.put('/editarTorneo/:idTorneo', [md_auth.Auth, md_roles.verAdministrador] , usuarioController.editarTorneo)
api.delete('/eliminarTorneo/:idTorneo', [md_auth.Auth, md_roles.verAdministrador], usuarioController.eliminarTorneo)
api.get('/verTorneos', [md_auth.Auth, md_roles.verAdministrador], usuarioController.verTorneos)

//Exportaciones
module.exports = api