const router = require('express').Router({mergeParams:true});
const Referencia = require('../models/Referencia').model;

router.get('/', async function(req, res){
    const result = await getAllReferencias();
    res.send(result);
});

router.get('/:referencia_id', async function(req, res){
    const result = await getReferenciaById(req.params.referencia_id);
    res.send(result);
});

router.post('/', async function(req, res){
    const result = await createReferencia(req.body);
    res.send(result);
});

async function getAllReferencias(){
    const result = await Referencia.find();
    return result;
}

async function getReferenciaById(id){
    const result = await Referencia.findById(id);
    return result;
}

async function createReferencia(referencia){
    const result = await Referencia.create(referencia);
    return result;
}

module.exports = router;
