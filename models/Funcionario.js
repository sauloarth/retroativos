const mongoose = require('mongoose');

const schema = mongoose.Schema({
    nome: String,
    matricula: String,
    retroativos: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Retroativo' 
    }]
});

const Funcionario = mongoose.model('Funcionario', schema);

module.exports = Funcionario;