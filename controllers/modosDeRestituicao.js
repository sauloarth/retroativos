const router = require('express').Router({mergeParams:true});
const ModoDeRestituicao = require('../models/ModoDeRestituicao').model;

router.get('/', async function(req, res){
    const result = await getAllModoDeRestituicao();
    res.send(result);
});

router.get('/:modoDeRestituicao_id', async function(req, res){
    const result = await getModoDeRestituicaoById(req.params.modoDeRestituicao_id);
    res.send(result);
});

router.post('/', async function(req, res){
    const result = await createModoDeRestituicao(req.body);
    res.send(result);
});

async function getAllModoDeRestituicao(){
    const result = await ModoDeRestituicao.find();
    return result;
}

async function getModoDeRestituicaoById(id){
    const result = await ModoDeRestituicao.findById(id);
    return result;
}

async function createModoDeRestituicao(referencia){
    const result = await ModoDeRestituicao.create(referencia);
    return result;
}

module.exports = router;