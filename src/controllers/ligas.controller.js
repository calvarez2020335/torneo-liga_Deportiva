const Liga = require("../models/ligas.model");

function crearLiga(req, res) {
  const parametros = req.body;
  const ligasModel = new Liga();

  if (parametros.nombreLiga) {
    ligasModel.nombreLiga = parametros.nombreLiga;

    Liga.find(
      { nombreLiga: { $regex: parametros.nombreLiga, $options: "i" } },
      (err, ligaEncontrada) => {
        if (ligaEncontrada.length == 0) {
          if (req.user.rol == "ROL_USUARIO") {
            ligasModel.usuario = req.user.sub;
            ligasModel.save((err, ligaGuardada) => {
              if (err)
                return res
                  .status(403)
                  .send({ mensaje: "Error en la pericion de la liga" });
              if (!ligaGuardada)
                return res.status(403).send({ mensaje: "Error al crear liga" });

              return res.status(200).send({ Liga: ligaGuardada });
            });
          } else {
            const idUsuario = req.params.idUsuario;
            if (idUsuario) {
              ligasModel.usuario = idUsuario;
              ligasModel.save((err, ligaGuardada) => {
                if (err)
                  return res
                    .status(403)
                    .send({ mensaje: "Error en la pericion de la liga" });
                if (!ligaGuardada)
                  return res
                    .status(403)
                    .send({ mensaje: "Error al crear liga" });
                return res.status(200).send({ LigaCreada: ligaGuardada });
              });
            } else {
              return res
                .status(403)
                .send({ mensaje: "Debe de enviar el id del usuario" });
            }
          }
        } else {
          return res
            .status(500)
            .send({ mensaje: "Este nombre ya esta siendo utilizado" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ error: "Debe enviar los parametros obligatorios" });
  }
}

function verLigas(req, res) {

  Liga.find(
    { usuario: req.user.sub },
    { nombreLiga: 1 },
    (err, ligasEncontradas) => {
      if (ligasEncontradas.length == 0) {
        return res.status(200).send({ mensaje: "Usted no tiene ligas credas" });
      } else {
        if (err)
          return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!ligasEncontradas)
          return res.status(500).send({ mensaje: "Error al buscar las ligas" });
        return res.status(200).send({ ligas: ligasEncontradas });
      }
    }
  );
}

function editarLigas(req, res) {
  const parametros = req.body;
  const ligaId = req.params.idLiga;

  Liga.findOne({ usuario: req.user.sub }, (err, ligasEncontradas) => {
    if (ligasEncontradas.usuario == req.user.sub) {
      return res.status(200).send({ mensaje: "Es tuyo" });
    } else {
      return res.status(403).send({ mensaje: "No es tuyo" });
    }
  });
}

module.exports = {
  crearLiga,
  verLigas,
  editarLigas,
};
