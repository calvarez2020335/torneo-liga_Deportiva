exports.verUsuario = function(req, res, next) {
    if(req.user.rol !== "ROL_USUARIO") return res.status(403).send({mensaje: "Solo puede acceder el usuario"})
    next();
}

exports.verAdministrador = function(req, res, next) {
    if(req.user.rol !== "ROL_ADMIN") return res.status(403).send({mensaje: "Solo puede acceder el ADMIN"})
    next();
}