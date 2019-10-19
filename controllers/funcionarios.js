const router = require('express').Router();
const Funcionario = require('../models/Funcionario');

router.get('/', async function(req, res) {
    let result;

    if(req.query.busca) {
        result = await getFuncionarios(req.query.busca);
    } else {
        result = await getAllFuncionarios();
    }
    res.send(result);
});

router.post('/', async function(req, res){
    const result = await createFuncionario(req.body);
    res.send(result);
});

router.put('/:id', async function(req, res){
    const result = await updateFuncionario(req.params.id, req.body);
    res.send(result);
});

router.delete('/:id', async function(req, res){
    const result = await deleteFuncionario(req.params.id);
    res.send(result);
})

async function getFuncionarios(query){
    const regexNome = new RegExp(`.*${query}.*`, 'i');
    const regexMatricula = new RegExp(`^${query}.*`);
    const result = await Funcionario
        .find()
        .or([{nome: regexNome}, {matricula: regexMatricula}]);
    console.log('Result: ', result);
    return result;
}

async function getAllFuncionarios(){
    const result = await Funcionario.find();
    console.log('Result: ', result);
    return result;
}

async function createFuncionario(funcionario){
    const result = await Funcionario.create(funcionario);
    console.log(result);
    return result;
}

async function updateFuncionario(id, funcionario){
    const result = await Funcionario.findByIdAndUpdate(
        {_id:id}, 
        funcionario,
        {new: true});

    return result;
}

async function deleteFuncionario(id){
    const result = await Funcionario.findByIdAndDelete({_id:id});
    console.log(result);
    return result;
}

module.exports = router;

