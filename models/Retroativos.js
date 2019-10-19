const mongoose = require('mongoose');
const itensSchema = require('./Item').schema;
const referenciaSchema = require('./Referencia').schema;
const modoDeRestituicaoSchema = require('./ModoDeRestituicao').schema;

const schema = mongoose.Schema({
    funcionario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funcionario'
    },
    documento: String,
    referencia: referenciaSchema,
    modoDeRestituicao: modoDeRestituicaoSchema,
    numeroPagpdt: String,
    itens: [itensSchema],
    valorTotal: { type: Number, default: 0 },
    emissao: { type: Date, default: Date.now }
})

const Retroativo = mongoose.model('Retroativo', schema);

module.exports = Retroativo;