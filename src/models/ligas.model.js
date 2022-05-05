const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigaSchema = Schema({
    nombreLiga: String,
    torneo: {type: Schema.Types.ObjectId, ref:'torneos'},
    usuario: {type: Schema.Types.ObjectId, ref:'usuarios'}
})

module.exports = mongoose.model('Ligas', LigaSchema)