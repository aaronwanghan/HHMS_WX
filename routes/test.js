var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
	//var v = req.params.v;
	res.render("test");
});

router.get('/item',function(req, res, next){
	res.render("item",{});
})

module.exports = router;