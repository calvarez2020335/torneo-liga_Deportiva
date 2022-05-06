const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = Schema({
    nombreEquipo: String,
    liga: {type: Schema.Types.ObjectId, ref:'Ligas'},
    puntos: Number,
    golesFavor: Number,
    golesContra: Number,
    diferenciaGoles: Number,
    usuario: {type: Schema.Types.ObjectId, ref:'Usuarios'}
})