const Liga = require('../models/ligas.model')
const Torneo = require('../models/torneos.model')

function crearLiga(req, res){
    const idTorneo = req.params.idTorneo;
    const parametros = req.body;
    const ligasModel = new Liga();

    if(parametros.nombreLiga){

        ligasModel.nombreLiga = parametros.nombreLiga;
        ligasModel.torneo = idTorneo;
        ligasModel.usuario = req.user.sub;

        Liga.find({nombreLiga: {$regex: parametros.nombreLiga, $options: "i"}}, (err, ligaEncontrada) => {

            if(ligaEncontrada.length == 0){

                ligasModel.save((err, ligaGuardada) => {

                    if(err) return res.status(403).send({mensaje: "Error en la pericion de la liga"})
                    if(!ligaGuardada) return res.status(403).send({mensaje: "Error al crear liga"})

                    return res.status(200).send({Liga: ligaGuardada})
                })
                    
            }else{
                return res.status(500).send({mensaje: "Este nombre ya esta siendo utilizado"})
            }

        })

    }else{
        return res.status(500).send({ error: "Debe enviar los parametros obligatorios"})
    }

}

module.exports ={
    crearLiga
}