const Jornadas = require("../models/jornadas.model");
const Equipos = require("../models/equipos.model");
const Liga = require("../models/ligas.model");

function crearJornada(req, res) {
  const modeloJornada = new Jornadas();
  const parametros = req.body;
  const idLiga = req.params.idLiga;

  if (parametros.nombreJornada) {
    Jornadas.find(
      {
        nombreJornada: { $regex: parametros.nombreJornada, $options: "i" },
        liga: idLiga,
      },
      (err, jornadaEncontrada) => {
        if (jornadaEncontrada.length == 0) {
          Jornadas.find({ liga: idLiga }, (err, jornadaLiga) => {
            Equipos.find({ liga: idLiga }, (err, equiposLiga) => {
              if (equiposLiga.length % 2 == 0) {
                if (jornadaLiga.length >= equiposLiga.length - 1)
                  return res
                    .status(500)
                    .send({ mensaje: "Maximo de jornadas alcanzadas" });
                modeloJornada.nombreJornada = parametros.nombreJornada;
                modeloJornada.liga = idLiga;
                modeloJornada.usuario = req.user.sub;
                modeloJornada.save((err, modeloJornadaGuardado) => {
                  if (err)
                    return res
                      .status(500)
                      .send({ mensaje: "Error en la petición de jornada par" });
                  if (!modeloJornadaGuardado)
                    return res
                      .status(500)
                      .send({ mensaje: "Error al agregar jornadas par" });
                  return res
                    .status(200)
                    .send({ Jornada: modeloJornadaGuardado });
                });
              } else if (equiposLiga.length % 2 == 1) {
                if (jornadaLiga.length >= equiposLiga.length)
                  return res
                    .status(500)
                    .send({ mensaje: "Maximo de jornadas guardadas inpar" });

                modeloJornada.nombreJornada = parametros.nombreJornada;
                modeloJornada.liga = idLiga;
                modeloJornada.usuario = req.user.sub;
                modeloJornada.save((err, modeloJornadaGuardado) => {
                  if (err)
                    return res
                      .status(500)
                      .send({ mensaje: "Error en la petición de jornada par" });
                  if (!modeloJornadaGuardado)
                    return res
                      .status(500)
                      .send({ mensaje: "Error al agregar jornadas par" });
                  return res
                    .status(200)
                    .send({ Jornada: modeloJornadaGuardado });
                });
              } else {
                return res
                  .status(404)
                  .send("Error al hacer el calculo de los equipos.");
              }
            });
          });
        } else {
          return res
            .status(500)
            .send({ mensaje: "Este nombre ya esta en uso" });
        }
      }
    );
  }
}

function agregarPartido(req, res) {
  const jornadaId = req.params.jornadaId;
  const parametros = req.body;
  if (
    parametros.equipo1 &&
    parametros.equipo2 &&
    parametros.goles1 &&
    parametros.goles2
  ) {
    Jornadas.findOne(
      {
        _id: jornadaId,
        partidos: { $elemMatch: { equipo1: parametros.equipo1 } },
      },
      (err, equipo1Encontrado) => {
        if (equipo1Encontrado)
          return res
            .status(500)
            .send({ mensaje: "El equipo ya esta registrado en la jornada" });
        if (err)
          return res
            .status(500)
            .send({ mensaje: "Error en la peticion de buscar equipo 1" });
        if (!equipo1Encontrado) {
          Jornadas.findOne(
            {
              _id: jornadaId,
              partidos: { $elemMatch: { equipo2: parametros.equipo2 } },
            },
            (err, equipo2Encontrado) => {
              if (equipo2Encontrado)
                return res.status(500).send({
                  mensaje: "El equipo ya esta registrado en la jornada 2",
                });
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error en la peticion de buscar equipo 2" });
              if (!equipo2Encontrado) {
                Jornadas.findById(
                  jornadaId,
                  { liga: 1, _id: 0 },
                  (err, idJornadaLiga) => {
                    Jornadas.findById(
                      jornadaId,
                      { partidos: 1, _id: 0 },
                      (err, idPartidoJornada) => {
                        Equipos.find({ idJornadaLiga }, (err, equipoXliga) => {
                          if (equipoXliga.length % 2 == 0) {
                            if (
                              idPartidoJornada.partidos.length >=
                              equipoXliga.length / 2
                            ) {
                              return res.status(500).send({
                                mensaje:
                                  "Maximo de partidos por jornada alcanzados",
                              });
                            } else {
                              //Logica aqui
                              if(parametros.goles1 > parametros.goles2) {

                                const data1 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                const data2 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                Equipos.findOne({nombreEquipo: parametros.equipo1}, (err, equipoEncontrado)=>{
                                  Equipos.findOne({nombreEquipo: parametros.equipo2}, (err, equipoEncontrado2)=>{
                                    //Equipo 1
                                    data1.puntos = parseInt(equipoEncontrado.puntos) + parseInt(3)
                                    data1.golesFavor = parseInt(equipoEncontrado.golesFavor) + parseInt(parametros.goles1);
                                    data1.golesContra = parseInt(equipoEncontrado.golesContra) + parseInt(parametros.goles2);
                                    data1.diferenciaGoles = data1.golesFavor - data1.golesContra;
                                    //Equipo 2
                                    data2.puntos = parseInt(equipoEncontrado2.puntos) + parseInt(0);
                                    data2.golesFavor = parseInt(equipoEncontrado2.golesFavor) + parseInt(parametros.goles2);
                                    data2.golesContra = parseInt(equipoEncontrado2.golesContra) + parseInt(parametros.goles1)
                                    data2.diferenciaGoles = data2.golesFavor - data2.golesContra
                                    Equipos.findByIdAndUpdate(equipoEncontrado.id, data1, {new: true}, (err, equipo1Actualizado)=>{
                                      Equipos.findByIdAndUpdate(equipoEncontrado2.id, data2, {new: true}, (err, equipo2Actualizado)=>{
                                        Jornadas.findByIdAndUpdate(jornadaId, {$push:{partidos: [{
                                          equipo1: parametros.equipo1,
                                          goles1: parametros.goles1,
                                          equipo2: parametros.equipo2,
                                          goles2: parametros.goles2
                                        }]}}, {new: true}, (err, Jornadas)=>{
                                          return res.status(200).send({partido: Jornadas})
                                        })
                                      })
                                    })
                                  })
                                })

                              }else if(parametros.goles1 == parametros.goles2){

                                const data1 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                const data2 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                Equipos.findOne({nombreEquipo: parametros.equipo1}, (err, equipoEncontrado)=>{
                                  Equipos.findOne({nombreEquipo: parametros.equipo2}, (err, equipoEncontrado2)=>{
                                    //Equipo 1
                                    data1.puntos = parseInt(equipoEncontrado.puntos) + parseInt(1)
                                    data1.golesFavor = parseInt(equipoEncontrado.golesFavor) + parseInt(parametros.goles1);
                                    data1.golesContra = parseInt(equipoEncontrado.golesContra) + parseInt(parametros.goles2);
                                    data1.diferenciaGoles = data1.golesFavor - data1.golesContra;
                                    //Equipo 2
                                    data2.puntos = parseInt(equipoEncontrado2.puntos) + parseInt(1);
                                    data2.golesFavor = parseInt(equipoEncontrado2.golesFavor) + parseInt(parametros.goles2);
                                    data2.golesContra = parseInt(equipoEncontrado2.golesContra) + parseInt(parametros.goles1)
                                    data2.diferenciaGoles = data2.golesFavor - data2.golesContra
                                    Equipos.findByIdAndUpdate(equipoEncontrado.id, data1, {new: true}, (err, equipo1Actualizado)=>{
                                      Equipos.findByIdAndUpdate(equipoEncontrado2.id, data2, {new: true}, (err, equipo2Actualizado)=>{
                                        Jornadas.findByIdAndUpdate(jornadaId, {$push:{partidos: [{
                                          equipo1: parametros.equipo1,
                                          goles1: parametros.goles1,
                                          equipo2: parametros.equipo2,
                                          goles2: parametros.goles2
                                        }]}}, {new: true}, (err, Jornadas)=>{
                                          return res.status(200).send({partido: Jornadas})
                                        })
                                      })
                                    })
                                  })
                                })

                              }else if(parametros.goles1 < parametros.goles2){

                                const data1 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                const data2 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                Equipos.findOne({nombreEquipo: parametros.equipo1}, (err, equipoEncontrado)=>{
                                  Equipos.findOne({nombreEquipo: parametros.equipo2}, (err, equipoEncontrado2)=>{
                                    //Equipo 1
                                    data1.puntos = parseInt(equipoEncontrado.puntos) + parseInt(0)
                                    data1.golesFavor = parseInt(equipoEncontrado.golesFavor) + parseInt(parametros.goles1);
                                    data1.golesContra = parseInt(equipoEncontrado.golesContra) + parseInt(parametros.goles2);
                                    data1.diferenciaGoles = data1.golesFavor - data1.golesContra;
                                    //Equipo 2
                                    data2.puntos = parseInt(equipoEncontrado2.puntos) + parseInt(3);
                                    data2.golesFavor = parseInt(equipoEncontrado2.golesFavor) + parseInt(parametros.goles2);
                                    data2.golesContra = parseInt(equipoEncontrado2.golesContra) + parseInt(parametros.goles1)
                                    data2.diferenciaGoles = data2.golesFavor - data2.golesContra
                                    Equipos.findByIdAndUpdate(equipoEncontrado.id, data1, {new: true}, (err, equipo1Actualizado)=>{
                                      Equipos.findByIdAndUpdate(equipoEncontrado2.id, data2, {new: true}, (err, equipo2Actualizado)=>{
                                        Jornadas.findByIdAndUpdate(jornadaId, {$push:{partidos: [{
                                          equipo1: parametros.equipo1,
                                          goles1: parametros.goles1,
                                          equipo2: parametros.equipo2,
                                          goles2: parametros.goles2
                                        }]}}, {new: true}, (err, Jornadas)=>{
                                          return res.status(200).send({partido: Jornadas})
                                        })
                                      })
                                    })
                                  })
                                })

                              }else{
                                return res.status(500).send({mensaje: "Error al calcular los puntos par"})
                              }
                              
                            }
                          } else {
                            //inpar
                            if (
                              idPartidoJornada.partidos.length >=
                              (equipoXliga.length - 1) / 2
                            ) {
                              return res.status(500).send({
                                mensaje:
                                  "Maximo de partidos por jornada alcanzados",
                              });
                            } else {
                              //Logica
                              if(parametros.goles1 > parametros.goles2) {
                                const data1 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                const data2 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                Equipos.findOne({nombreEquipo: parametros.equipo1}, (err, equipoEncontrado)=>{
                                  Equipos.findOne({nombreEquipo: parametros.equipo2}, (err, equipoEncontrado2)=>{
                                    //Equipo 1
                                    data1.puntos = parseInt(equipoEncontrado.puntos) + parseInt(3)
                                    data1.golesFavor = parseInt(equipoEncontrado.golesFavor) + parseInt(parametros.goles1);
                                    data1.golesContra = parseInt(equipoEncontrado.golesContra) + parseInt(parametros.goles2);
                                    data1.diferenciaGoles = data1.golesFavor - data1.golesContra;
                                    //Equipo 2
                                    data2.puntos = parseInt(equipoEncontrado2.puntos) + parseInt(0);
                                    data2.golesFavor = parseInt(equipoEncontrado2.golesFavor) + parseInt(parametros.goles2);
                                    data2.golesContra = parseInt(equipoEncontrado2.golesContra) + parseInt(parametros.goles1)
                                    data2.diferenciaGoles = data2.golesFavor - data2.golesContra
                                    Equipos.findByIdAndUpdate(equipoEncontrado.id, data1, {new: true}, (err, equipo1Actualizado)=>{
                                      Equipos.findByIdAndUpdate(equipoEncontrado2.id, data2, {new: true}, (err, equipo2Actualizado)=>{
                                        Jornadas.findByIdAndUpdate(jornadaId, {$push:{partidos: [{
                                          equipo1: parametros.equipo1,
                                          goles1: parametros.goles1,
                                          equipo2: parametros.equipo2,
                                          goles2: parametros.goles2
                                        }]}}, {new: true}, (err, Jornadas)=>{
                                          return res.status(200).send({partido: Jornadas})
                                        })
                                      })
                                    })
                                  })
                                })
                              }else if(parametros.goles1 == parametros.goles2){

                                const data1 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                const data2 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                Equipos.findOne({nombreEquipo: parametros.equipo1}, (err, equipoEncontrado)=>{
                                  Equipos.findOne({nombreEquipo: parametros.equipo2}, (err, equipoEncontrado2)=>{
                                    //Equipo 1
                                    data1.puntos = parseInt(equipoEncontrado.puntos) + parseInt(1)
                                    data1.golesFavor = parseInt(equipoEncontrado.golesFavor) + parseInt(parametros.goles1);
                                    data1.golesContra = parseInt(equipoEncontrado.golesContra) + parseInt(parametros.goles2);
                                    data1.diferenciaGoles = data1.golesFavor - data1.golesContra;
                                    //Equipo 2
                                    data2.puntos = parseInt(equipoEncontrado2.puntos) + parseInt(1);
                                    data2.golesFavor = parseInt(equipoEncontrado2.golesFavor) + parseInt(parametros.goles2);
                                    data2.golesContra = parseInt(equipoEncontrado2.golesContra) + parseInt(parametros.goles1)
                                    data2.diferenciaGoles = data2.golesFavor - data2.golesContra
                                    Equipos.findByIdAndUpdate(equipoEncontrado.id, data1, {new: true}, (err, equipo1Actualizado)=>{
                                      Equipos.findByIdAndUpdate(equipoEncontrado2.id, data2, {new: true}, (err, equipo2Actualizado)=>{
                                        Jornadas.findByIdAndUpdate(jornadaId, {$push:{partidos: [{
                                          equipo1: parametros.equipo1,
                                          goles1: parametros.goles1,
                                          equipo2: parametros.equipo2,
                                          goles2: parametros.goles2
                                        }]}}, {new: true}, (err, Jornadas)=>{
                                          return res.status(200).send({partido: Jornadas})
                                        })
                                      })
                                    })
                                  })
                                })

                              }else if(parametros.goles1 < parametros.goles2){

                                const data1 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                const data2 = {
                                  puntos: 0,
                                  golesFavor : 0,
                                  golesContra: 0,
                                  diferenciaGoles: 0
                                }
                                Equipos.findOne({nombreEquipo: parametros.equipo1}, (err, equipoEncontrado)=>{
                                  Equipos.findOne({nombreEquipo: parametros.equipo2}, (err, equipoEncontrado2)=>{
                                    //Equipo 1
                                    data1.puntos = parseInt(equipoEncontrado.puntos) + parseInt(0)
                                    data1.golesFavor = parseInt(equipoEncontrado.golesFavor) + parseInt(parametros.goles1);
                                    data1.golesContra = parseInt(equipoEncontrado.golesContra) + parseInt(parametros.goles2);
                                    data1.diferenciaGoles = data1.golesFavor - data1.golesContra;
                                    //Equipo 2
                                    data2.puntos = parseInt(equipoEncontrado2.puntos) + parseInt(3);
                                    data2.golesFavor = parseInt(equipoEncontrado2.golesFavor) + parseInt(parametros.goles2);
                                    data2.golesContra = parseInt(equipoEncontrado2.golesContra) + parseInt(parametros.goles1)
                                    data2.diferenciaGoles = data2.golesFavor - data2.golesContra
                                    Equipos.findByIdAndUpdate(equipoEncontrado.id, data1, {new: true}, (err, equipo1Actualizado)=>{
                                      Equipos.findByIdAndUpdate(equipoEncontrado2.id, data2, {new: true}, (err, equipo2Actualizado)=>{
                                        Jornadas.findByIdAndUpdate(jornadaId, {$push:{partidos: [{
                                          equipo1: parametros.equipo1,
                                          goles1: parametros.goles1,
                                          equipo2: parametros.equipo2,
                                          goles2: parametros.goles2
                                        }]}}, {new: true}, (err, Jornadas)=>{
                                          return res.status(200).send({partido: Jornadas})
                                        })
                                      })
                                    })
                                  })
                                })

                              }else{
                                return res.status(500).send({mensaje: "Erron a la hora de hacer el puntaje"})
                              }
                              
                            }
                          }
                        });
                      }
                    );
                  }
                );
              }
            }
          );
        }
      }
    );
  } else {
    return res
      .status(500)
      .send({ mensaje: " Debe enviar los parametros obligatorios" });
  }
}

function verTablaDePosiciones(req, res){
  const idLiga = req.params.idLiga;
  Liga.findOne({ _id: idLiga }, (err, equipoLiga) => {
    if (equipoLiga.usuario == req.user.sub) {
      Equipos.find({ liga: idLiga },{_id:0,liga:0,usuario:0}, (err, equipoEquipo) => {
        return res.status(200).send({ Equipos: equipoEquipo });
      }).sort({puntos:-1});
    } else {
      return res
        .status(404)
        .send({ error: "No puedes ver los equipos de esta liga" });
    }
  });
}



module.exports = {
  crearJornada,
  agregarPartido,
  verTablaDePosiciones
};