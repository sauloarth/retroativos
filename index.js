const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/retroativodb', 
    {useNewUrlParser: true, useUnifiedTopology: true},() => {
    console.log('Connected to retroativodb.');
})


//configurações
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//routes
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/cadastrar', function(req, res) {
    res.render('pages/cadastrar');
});

app.get('/funcionarios/:id/retroativos/new',  async function(req, res) {
    const funcionario = await getFuncionarioById(req.params.id);
    res.render('pages/retroativosNew', {
        funcionario: funcionario,
        formaDePagamento: formaDePagamento,
        tipoDoRetroativo: tipoDoRetroativo
    });
});

app.get('/funcionarios', async function(req, res) {
    console.log('Query: ', req.query);
    const result = await getFuncionarios(req.query.busca);
    res.send(result);
});

app.get('/funcionarios/:id/retroativos', async(req, res) =>{
    const funcionario = await getFuncionarioById(req.params.id);
    const retroativos = await getRetroativosByFuncionario(funcionario);
    
    console.log(funcionario);
    console.log(retroativos);
    res.render('pages/retroativo', {
        funcionario: funcionario, retroativos: retroativos});
});
    
app.post('/funcionarios/:id/retroativos', async(req, res) => {
    const funcionario = await getFuncionarioById(req.params.id);
    const retroativoSalvo = await saveRetroativo(req.body.formaDePagamento, req.body.tipoDoRetroativo, funcionario);
    res.render('pages/mesesDePagamento', {
        retroativo: retroativoSalvo,
        funcionario: funcionario
    })
})

//Schema 
const funcionarioSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nome: String,
    matricula: String,
    retroativos: [{
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'onModel' 
    }],
    onModel: {
        type:'String',
        required:true,
        enum: ['Pagpdt', 'ExercicioFindo']
    }
});

const retroativoPAGPDTSchema = mongoose.Schema({
    funcionario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Funcionario'
    },
    tipoDoRetroativo: String,
    numeroPAGPDT: String,
    mesesDePagamento: [{
        dataInicialDoMes: Date,
        dataFinalDoMes: Date,
        vencimentoDoMes: Number,
        totalDoMes: Number
    }],
    totalDoRetroativo: {type: Number, default:0},
    dataEmissao: {type: Date, default: Date.now}
})

const retroativoExercicioFindoSchema = mongoose.Schema({
    funcionario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Funcionario'
    },
    tipoDoRetroativo: String,
    mesesDePagamento: [{
        dataInicialDoMes: Date,
        dataFinalDoMes: Date,
        vencimentoDoMes: Number,
        atualizacaoMonetaria: Number,
        totalDoMes: Number
    }],
    totalDoRetroativo: {type: Number, default:0},
    dataEmissao: {type: Date, default: Date.now}
})


const Funcionario = mongoose.model('Funcionario', funcionarioSchema);
const Pagpdt = mongoose.model('Pagpdt', retroativoPAGPDTSchema);
const ExercicioFindo = mongoose.model('ExercicioFindo', retroativoExercicioFindoSchema);

async function resetFuncionariosCollection(){
    const result = await Funcionario.deleteMany({_id:{$exists:true}});
    console.log('Result of restarting Funcionarios: ', result);

    await Funcionario.create(new Funcionario({
        nome: 'Pele da Silva',
        matricula:'1234567'
    }))

    await Funcionario.create(new Funcionario({
        nome: 'Manoel Emancio',
        matricula:'1775839'
    }))

    await Funcionario.create(new Funcionario({
        nome: 'Crivaltino Mantega',
        matricula:'1839383'
    }))

    await Funcionario.create(new Funcionario({
        nome: 'Gilda Magalhães',
        matricula:'1909828'
    }))

    await Funcionario.create(new Funcionario({
        nome: 'Maria das Dores',
        matricula:'14020202'
    }))
}

//resetFuncionariosCollection();

async function resetRetroativos(){
    const limparPagpdt = await Pagpdt.deleteMany({_id: {$exists:true}});
    console.log('Result of restarting Pagpdt: ', limparPagpdt);

    const limparExercicioFindo = await ExercicioFindo.deleteMany({_id: {$exists:true}});
    console.log('Result of restarting ExercicioFindo: ', limparExercicioFindo);

    const funcionario1 = await Funcionario
        .findOne({nome: 'Pele da Silva'});
    
    const retroativo1 = new Pagpdt({
        funcionario: funcionario1._id,
        tipoDoRetroativo: 'Adicional de Insalubridade',
        numeroPAGPDT: '169/2019'
    }).save();
        
    const retroativo2 = new ExercicioFindo({
        funcionario: funcionario1._id,
        tipoDoRetroativo: 'Adicional de Insalubridade',
    }).save();

    const funcionario2 = await Funcionario
        .findOne({nome: 'Crivaltino Mantega'});
        
        
    const retroativo3 = new Pagpdt({
        funcionario: funcionario2._id,
        tipoDoRetroativo: 'Falta Justificada',
        numeroPAGPDT: '178/2015'
    }).save();
        
    const retroativo4 = new ExercicioFindo({
        funcionario: funcionario2._id,
        tipoDoRetroativo: 'Indenização de Transporte',
    }).save();
}

//resetRetroativos();

async function getFuncionarios(query){
    const regexNome = new RegExp(`.*${query}.*`, 'i');
    const regexMatricula = new RegExp(`^${query}.*`);
    const result = await Funcionario
        .find()
        .or([{nome: regexNome}, {matricula: regexMatricula}]);
    console.log(result);
    return result;
}

async function getFuncionarioById(id){
    const funcionario = await Funcionario.findById(id);
    console.log(funcionario);
    return funcionario;
}

async function getRetroativosByFuncionario(funcionario){
    let result = [];

    const pagpdts = await Pagpdt
        .find({funcionario: funcionario._id});

    const exercicioFindos = await ExercicioFindo
        .find({funcionario: funcionario._id});

    result.push(pagpdts);
    result.push(exercicioFindos);
    
    result = result.reduce((acc, val) => acc.concat(val), []);
    return result;
}

async function saveRetroativo(forma, tipo, funcionario){
    let retroativo;
    
    if(forma === formaDePagamento.PAGPDT) {
        console.log('é pagpdt')
        retroativo = new Pagpdt({
            funcionario: funcionario._id,
            tipoDoRetroativo: tipo
        });
    }
    
    if(forma === formaDePagamento.EXERCICIO_FINDO) {
        console.log('é exercicio findo');
        retroativo = new ExercicioFindo({
            funcionario: funcionario._id,
            tipoDoRetroativo: tipo
        });
    }

    const result = await retroativo.save();

    return result;
}


//iniciando servidor
const port = process.env.PORT || 5000;
app.listen(port, () =>{
    console.log('Servidor iniciado na porta ', port);
})  

//enums
const tipoDoRetroativo = {
    ADICIONAL_DE_INSALUBRIDADE: 'adicional de insalubridade',
    INDENIZACAO_DE_TRANSPORTE: 'indenização de transporte',
    GMOV: 'gmov',
    GCET: 'gcet',
    GAB: 'gab',
    FALTAS_COMPENSADAS: 'faltas compensados',
    ATRASOS_COMPENSADOS: 'atrasos compensados'
};

const formaDePagamento = {
    PAGPDT: 'pagpdt',
    EXERCICIO_FINDO: 'exercicio findo'
};
