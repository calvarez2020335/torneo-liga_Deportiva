const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function adminInicio(req, res) {
  const usuarioModel = new Usuario();

  usuarioModel.nombre = "ADMIN";
  usuarioModel.email = "ADMIN";
  usuarioModel.password = "deportes123";
  usuarioModel.rol = "ROL_ADMIN";

  Usuario.find({ email: "ADMIN" }, (err, usuarioEncontrado) => {
    if (usuarioEncontrado.length == 0) {
      bcrypt.hash("deportes123", null, null, (err, passwordEncriptada) => {
        usuarioModel.password = passwordEncriptada;

        usuarioModel.save((err, usuarioGuardado) => {
          if (err) return console.error({ mensaje: "Error en la peticion" });
          if (!usuarioGuardado)
            return console.error({ mensaje: "Error al agregar el Usuario" });

          return console.log({ usuario: usuarioGuardado });
        });
      });
    } else {
      return console.error({
        mensaje: "Administrador de inicio ya a sido creado",
      });
    }
  });
}

function registrarUsuario(req, res) {
  const usuarioModel = new Usuario();
  const parametro = req.body;

  if (parametro.nombre && parametro.email && parametro.password) {
    usuarioModel.nombre = parametro.nombre;
    usuarioModel.email = parametro.email;
    usuarioModel.password = parametro.password;
    usuarioModel.rol = "ROL_USUARIO";

    Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(
          parametro.password,
          null,
          null,
          (err, passwordEncriptada) => {
            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuarioGuardado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error en la petición" });
              if (!usuarioGuardado)
                return res
                  .status(500)
                  .send({ mensaje: "Error al crear el usuario" });
              return res.status(200).send({ usuarioCreado: usuarioGuardado });
            });
          }
        );
      } else {
        return res
          .status(400)
          .send({ mensaje: "Este correo ya estas siendo utilizado" });
      }
    });
  } else {
    return res
      .status(403)
      .send({ mensaje: "Debe enviar los parametros obligatorios" });
  }
}

function login(req, res) {
  const parametro = req.body;
  Usuario.findOne({ email: parametro.email }, (err, usuarioEncontrado) => {
    if (err)
      return res.status(500).send({ error: "Error en la petición: " + err });
    if (usuarioEncontrado) {
      bcrypt.compare(
        parametro.password,
        usuarioEncontrado.password,
        (err, verificacionPassword) => {
          if (verificacionPassword) {
            if (parametro.obtenerToken === "true") {
              return res
                .status(200)
                .send({ token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password == undefined;
              return res.status(200).send({ usuario: usuarioEncontrado });
            }
          } else {
            return res.status(500).send({ error: "La contraseña no coincide" });
          }
        }
      );
    } else {
      return res.status(404).send({
        error: "El correo no se encuentra registrado, cree su cuenta",
      });
    }
  });
}

function registrarUsuarioAdmin(req, res) {
  const parametro = req.body;
  const modeloUsuario = new Usuario();

  if (parametro.nombre && parametro.email && parametro.password) {
    modeloUsuario.nombre = parametro.nombre;
    modeloUsuario.email = parametro.email;
    modeloUsuario.password = parametro.password;
    modeloUsuario.rol = "ROL_ADMIN";

    Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(
          parametro.password,
          null,
          null,
          (err, passwordEncriptada) => {
            modeloUsuario.password = passwordEncriptada;

            modeloUsuario.save((err, usuarioGuardado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error en la petición" });
              if (!usuarioGuardado)
                return res
                  .status(500)
                  .send({ mensaje: "Error al agregar usuario admin" });
              return res
                .status(200)
                .send({ usuarioAdminCreado: usuarioGuardado });
            });
          }
        );
      } else {
        return res.status(500).send({ error: "El correo ya esta en uso" });
      }
    });
  } else {
    return res
      .status(500)
      .send({ error: "Debe de enviar los parametros obligatorios" });
  }
}

function editarUsuario(req, res) {
  const idUser = req.params.idUser;
  const parametros = req.body;

  Usuario.findOne({ _id: idUser }, (err, usuarioEncontrado) => {
    if (req.user.rol == "ROL_ADMIN") {
      if (usuarioEncontrado.rol !== "ROL_USUARIO") {
        return res
          .status(403)
          .send({ error: "Los administradores no se pueden editar" });
      } else {
        Usuario.findByIdAndUpdate(
          idUser,
          { $set: { nombre: parametros.nombre, email: parametros.email } },
          { new: true },
          (err, usuarioActualizado) => {
            if (err)
              return res.status(500).send({ error: "Error en la pericion" });
            if (!usuarioActualizado)
              return res
                .status(500)
                .send({ error: "Error al editar el usuario" });
            return res
              .status(200)
              .send({ usuarioActualizado: usuarioActualizado });
          }
        );
      }
    } else {
      Usuario.findByIdAndUpdate(
        req.user.sub,
        { $set: { nombre: parametros.nombre, email: parametros.email } },
        { new: true },
        (err, usuarioActualizado) => {
          if (err)
            return res
              .status(500)
              .send({ mensaje: "Error en la peticion del usuario" });
          if (!usuarioActualizado)
            return res
              .status(500)
              .send({ mensaje: "Error al editar el usuario" });
          return res
            .status(200)
            .send({ usuarioActualizado: usuarioActualizado });
        }
      );
    }
  });
}

function eliminarUsuarios(req, res){
  
}

module.exports = {
  adminInicio,
  registrarUsuario,
  login,
  registrarUsuarioAdmin,
  editarUsuario
};
