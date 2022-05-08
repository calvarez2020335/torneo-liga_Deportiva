const Liga = require("../models/ligas.model");
const jornadas = require("../models/jornadas.model");
const equipos = require("../models/equipos.model");

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

function verLigasUsuarios(req, res) {
  const idLiga = req.params.idUsuario;

  Liga.find({ usuario: idLiga }, { nombreLiga: 1 }, (err, ligasEncontradas) => {
    if (err) return res.status(400).send({ mensaje: "Error en la petición" });
    if (!ligasEncontradas)
      return res.status(500).send({ mensaje: "Error al buscar las ligas" });
    return res.status(200).send({ ligas: ligasEncontradas });
  });
}

function verTodasLigas(req, res) {
  Liga.find(
    {},
    { nombreLiga: 1, _id: 0, usuario: 1 },
    (err, LigasEncontradas) => {
      if (err) return res.status(404).send({ mensaje: err.message });
      if (!LigasEncontradas)
        return res.status(404).send({ mensaje: "Error al buscar x2" });
      return res.status(200).send({ Ligas: LigasEncontradas });
    }
  ).populate("usuario", "nombre");
}

function editarLigas(req, res) {
  const idLiga = req.params.idLiga;
  const parametros = req.body;

  Liga.findOne({ _id: idLiga }, (err, ligaUsuario) => {
    Liga.find({ nombreLiga: parametros.nombreLiga }, (err, ligaEncontrada) => {
      if (ligaEncontrada.length == 0) {
        if (req.user.rol == "ROL_ADMIN") {
          Liga.findByIdAndUpdate(
            idLiga,
            { $set: { nombreLiga: parametros.nombreLiga } },
            { new: true },
            (err, ligaActualizada) => {
              if (err)
                return res
                  .status(404)
                  .send({ mensaje: "Error en la pericion" });
              if (!ligaActualizada)
                return res.status(404).send({ mensaje: "Error al editar" });
              return res.status(200).send({ ligaActualizada: ligaActualizada });
            }
          );
        } else {
          if (req.user.sub == ligaUsuario.usuario) {
            Liga.findByIdAndUpdate(
              idLiga,
              { $set: { nombreLiga: parametros.nombreLiga } },
              { new: true },
              (err, ligaActualizada) => {
                if (err)
                  return res
                    .status(404)
                    .send({ mensaje: "Error en la peticion" });
                if (!ligaActualizada)
                  return res
                    .status(500)
                    .send({ mensaje: "Error al buscar la liga" });
                return res
                  .status(200)
                  .send({ ligaActualizada: ligaActualizada });
              }
            );
          } else {
            return res
              .status(500)
              .send({ error: "No puede editar otras ligas" });
          }
        }
      } else {
        return res.status(500).send({ mensaje: "El nombre ya esta en uso" });
      }
    });
  });
}

function eliminarLigas(req, res) {
  const idLiga = req.params.idLiga;
  Liga.findOne({ _id: idLiga }, (err, ligaUsuario) => {
    if (req.user.rol == "ROL_ADMIN") {

      jornadas.deleteMany({ liga: idLiga }, (err, ligaDeleted) => {
        if (err)return res.status(404).send({ mensaje: "Error en la peticion" });
      })

      equipos.deleteMany({ liga: idLiga }, (err, equipoDeleted)=>{
        if (err)return res.status(404).send({ mensaje: "Error en la peticion" });
      })

      Liga.findByIdAndDelete(idLiga, (err, ligaDelete)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!ligaDelete)return res.status(403).send({ mensaje: "Error al eliminar el usuario" });

        return res.status(200).send({ liga: ligaDelete });
      })

    } else {
      if (req.user.sub == ligaUsuario.usuario) {

        jornadas.deleteMany({ liga: idLiga }, (err, ligaDeleted) => {
          if (err)return res.status(404).send({ mensaje: "Error en la peticion" });
        })
  
        equipos.deleteMany({ liga: idLiga }, (err, equipoDeleted)=>{
          if (err)return res.status(404).send({ mensaje: "Error en la peticion" });
        })
  
        Liga.findByIdAndDelete(idLiga, (err, ligaDelete)=>{
          if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!ligaDelete)return res.status(403).send({ mensaje: "Error al eliminar el usuario" });
  
          return res.status(200).send({ liga: ligaDelete });
        })

      } else {
        return res
          .status(500)
          .send({ error: "No puede eliminar ligas que no le pertenezcan" });
      }
    }
  });
}

module.exports = {
  crearLiga,
  verLigas,
  editarLigas,
  verLigasUsuarios,
  verTodasLigas,
  eliminarLigas,
};
