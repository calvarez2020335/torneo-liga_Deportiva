const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JornadaSchema = Schema({
    nombreJornada: String,
    liga: {type: Schema.Types.ObjectId, ref:'Ligas'},
    partidos:[{
        equipo1: String,
        goles1: Number,
        equipo2: String,
        goles2: Number,
    }],
    usuario: {type: Schema.Types.ObjectId, ref:'Usuarios'}
})

module.exports = mongoose.model('Jornadas', JornadaSchema)