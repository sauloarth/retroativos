//Modelo define como o valor será restituído
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    descricao: {type:String, required:true}
});

const ModoDeRestituicao = mongoose.model('ModoDeRestituicao', schema);

module.exports.model = ModoDeRestituicao;
module.exports.schema = schema;