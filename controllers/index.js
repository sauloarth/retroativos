const router = require('express').Router();

router.get('/', function(req, res) {
    res.render('funcionarios/index');
});


module.exports = router;