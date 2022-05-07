const Equipos = require("../models/equipos.model");
const Liga = require("../models/ligas.model");

function crearEquipo(req, res) {
  const equipoModel = new Equipos();
  const parametros = req.body;

  if (parametros.nombreEquipo && parametros.liga) {
    equipoModel.nombreEquipo = parametros.nombreEquipo;
    equipoModel.liga = parametros.liga;
    equipoModel.puntos = 0;
    equipoModel.golesFavor = 0;
    equipoModel.golesContra = 0;
    equipoModel.diferenciaGoles = 0;

    Equipos.find(
      { nombreEquipo: { $regex: parametros.nombreEquipo, $options: "i" } },
      (err, EquipoGeneralEncontrados) => {
        if (EquipoGeneralEncontrados.length == 0) {
          if (req.user.rol == "ROL_USUARIO") {
            equipoModel.usuario = req.user.sub;

            Liga.findOne({ _id: parametros.liga }, (err, equipoLiga) => {
              if (equipoLiga.usuario == req.user.sub) {
                Equipos.findOne(
                  {
                    nombreEquipo: {
                      $regex: parametros.nombreEquipo,
                      $options: "i",
                    },
                    liga: parametros.liga,
                    usuario: req.user.sub,
                  },
                  (err, equipoEncontrado) => {
                    if (err)
                      return res
                        .status(500)
                        .send({ mensaje: "Error en la petición" }); //
                    if (!equipoEncontrado) {
                      Equipos.find(
                        { liga: parametros.liga },
                        (err, equipoLigaEncontrado) => {
                          if (err)
                            return res
                              .status(500)
                              .send({ mensaje: "Error en la petición" });
                          if (equipoLigaEncontrado.length >= 10) {
                            return res.status(500).send({
                              mensaje: "Solo puede agregar 10 equipos por liga",
                            });
                          } else {
                            equipoModel.save((err, equipoGuardado) => {
                              if (err)
                                return res.status(500).send({
                                  mensaje: "Error en la petición de guardado",
                                });
                              if (!equipoGuardado)
                                return res.status(500).send({
                                  mensaje: "Error al guardar el equipo",
                                });
                              return res
                                .status(200)
                                .send({ equipo: equipoGuardado });
                            });
                          }
                        }
                      );
                    } else {
                      return res.status(500).send({
                        mensaje: "Este equipo ya a sido creado en esta liga",
                      });
                    }
                  }
                );
              } else {
                return res
                  .status(500)
                  .send({ mensaje: "No puede agregar equipos a esta liga" });
              }
            });
          } else {
            //Administrador
            const idUsuario = req.params.idUsuario;
            equipoModel.usuario = idUsuario;

            if (idUsuario) {
              Liga.findOne({ _id: parametros.liga }, (err, equipoLiga) => {
                if (equipoLiga.usuario == idUsuario) {
                  Equipos.findOne(
                    {
                      nombreEquipo: {
                        $regex: parametros.nombreEquipo,
                        $options: "i",
                      },
                      liga: parametros.liga,
                      usuario: idUsuario,
                    },
                    (err, equipoEncontrado) => {
                      if (err)
                        return res
                          .status(500)
                          .send({ mensaje: "Error en la petición" });

                      if (!equipoEncontrado) {
                        Equipos.find(
                          { liga: parametros.liga },
                          (err, equipoLigaEncontrado) => {
                            if (err)
                              return res
                                .status(500)
                                .send({ mensaje: "Error en la petición" });
                            if (equipoLigaEncontrado.length >= 10) {
                              return res.status(500).send({
                                mensaje:
                                  "Solo puede agregar 10 equipos por liga",
                              });
                            } else {
                              equipoModel.save((err, equipoGuardado) => {
                                if (err)
                                  return res.status(500).send({
                                    mensaje: "Error en la petición de guardado",
                                  });
                                if (!equipoGuardado)
                                  return res.status(500).send({
                                    mensaje: "Error al guardar el equipo",
                                  });
                                return res
                                  .status(200)
                                  .send({ equipo: equipoGuardado });
                              });
                            }
                          }
                        );
                      } else {
                        return res.status(500).send({
                          mensaje: "Este equipo ya a sido creado en esta liga",
                        });
                      }
                    }
                  );
                } else {
                  return res.status(500).send({
                    mensaje:
                      "No se puede agregar equipos a esta liga por que el usuario no la creo",
                  });
                }
              });
            } else {
              return res
                .status(500)
                .send({ mensaje: "Necesita el id del usuario" });
            }
          }

          //final
        } else {
          return res
            .status(500)
            .send({ mensaje: "El nombre del equipo ya esta en uso" });
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ error: "Debe enviar los parametros obligatorios" });
  }
}

function verTodosEquipos(req, res) {
  if (req.user.rol == "ROL_USUARIO") {
    Equipos.find(
      { usuario: req.user.sub },
      { usuario: 0, _id: 0 },
      (err, equiposEncontrados) => {
        if (err) return res.status(500).send({ error: "Error en la peticion" });
        if (!equiposEncontrados)
          return res.status(500).send({ error: "Error al encontrar equipos" });
        return res.status(200).send({ misLigas: equiposEncontrados });
      }
    ).populate("liga", "nombreLiga");
  } else {
    const idUsuario = req.params.idUsuario;
    if (idUsuario) {
      Equipos.find(
        { usuario: idUsuario },
        { usuario: 0, _id: 0 },
        (err, equiposEncontrados) => {
          if (err)
            return res.status(500).send({ error: "Error en la peticion" });
          if (!equiposEncontrados)
            return res
              .status(500)
              .send({ error: "Error al encontrar equipos" });
          return res.status(200).send({ LigasDelUsuario: equiposEncontrados });
        }
      ).populate("liga", "nombreLiga");
    } else {
      return res.status(404).send({ error: "Necesita el id del usuario" });
    }
  }
}

function verEquiposPorLiga(req, res) {
    if(req.user.rol == "ROL_USUARIO"){
        const idLiga = req.params.idLiga;

        

    }
}

module.exports = {
  crearEquipo,
  verTodosEquipos,
};
