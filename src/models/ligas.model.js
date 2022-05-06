const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigaSchema = Schema({
    nombreLiga: String,
    usuario: {type: Schema.Types.ObjectId, ref:'usuarios'}
})

module.exports = mongoose.model('Ligas', LigaSchema)