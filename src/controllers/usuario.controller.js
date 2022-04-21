const Usuario = require('../models/usuario.model')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('../services/jwt')

function adminPorDefecto(req, res) {
}

module.exports = {
    adminPorDefecto,
}