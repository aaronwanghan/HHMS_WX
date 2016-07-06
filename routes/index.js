var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '元向健康' });
});

router.get('/login',function(req,res,next){
	res.render('login',{v:req.body.v});
});

router.get('/tests',function(req,res,next){
	res.render('tests');
});

module.exports = router;
