const router = require('express').Router({mergeParams: true});
const Retroativo = require('../models/Retroativos');
const Referencia = require('../models/Referencia').model;
const ModoDeRestituicao = require('../models/ModoDeRestituicao').model;

router.get('/', async function(req, res) {
    const result = await getAllRetroativosByFuncionario(
        req.params.funcionario_id);
    res.send(result);
});

router.get('/:retroativo_id', async function(req, res) {
    const result = await getRetroativosByIdByFuncionario(
        req.params.funcionario_id, req.params.retroativo_id);
    res.send(result);
});

router.post('/', async function(req, res){
    const result = await createRetroativo(
        req.params.funcionario_id, req.body);
    res.send(result);
});

router.put('/:retroativo_id', async function(req, res){
    const result = await updateRetroativo(req.params.retroativo_id, 
        req.body);
    res.send(result);
})


router.delete('/:retroativo_id', async function(req, res){
    const result = await deleteRetroativo(req.params.retroativo_id);
    res.send(result);
})

async function getAllRetroativosByFuncionario(funcionario_id){
    const result = await Retroativo
        .find({funcionario: funcionario_id})
        .populate({path: 'funcionario', select: 'nome matricula _id'});
    console.log('Result: ', result);
    return result;
}

async function getRetroativosByIdByFuncionario(funcionario_id, 
    retroativo_id, retroativo){
    const result = await Retroativo.findByIdAndUpdate({
        funcionario: funcionario_id,
        _id: retroativo_id
    });
    console.log('Result: ', result);
    return result;
}


async function createRetroativo(funcionario_id, retroativo){
    retroativo.funcionario = funcionario_id;
 
    const referencia = await Referencia
        .findById(retroativo.referencia);
    const modoDeRestituicao = await ModoDeRestituicao
        .findById(retroativo.modoDeRestituicao);
    
    retroativo.referencia = referencia;
    retroativo.modoDeRestituicao = modoDeRestituicao;

    const result = await Retroativo.create(retroativo);
    console.log(result);
    return result;
}

async function updateRetroativo(id, retroativo){
    if(retroativo.referencia){
        const referencia = await Referencia
            .findById(retroativo.referencia);

        retroativo.referencia = referencia;
    }

    if(retroativo.modoDeRestituicao){
        const modoDeRestituicao = await ModoDeRestituicao
            .findById(retroativo.modoDeRestituicao);

        retroativo.modoDeRestituicao = modoDeRestituicao;
    }
    

    const result = await Retroativo.findByIdAndUpdate(
        {_id: id},
        retroativo,
        {new: true}
    );

    console.log(result);
    return result;
}

async function deleteRetroativo(id){
    const result = await Retroativo.findByIdAndDelete({_id:id});
    console.log(result);
    return result;
}

module.exports = router;

