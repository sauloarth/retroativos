//Trata-se de um item de retroativo
const mongoose = require('mongoose');

const schema = mongoose.Schema({
    inicioDoPagto: Date,
    fimDoPagto: Date,
    juros: Number,
    salario: Number,
    totalAReceber: Number
})

const model = mongoose.model('Item', schema);

module.exports.model = model;
module.exports.schema = schema;