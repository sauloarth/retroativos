//Modelo define qual tipo de verba será ressarcida
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    descricao: {type:String, required:true}
});

const Referencia = mongoose.model('Referencia', schema);

module.exports.model = Referencia;
module.exports.schema = schema;