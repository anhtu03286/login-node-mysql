var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
    if(typeof req.session.username === 'undefined'){
        res.redirect('users/login');
    } else {
        res.render('admin/dashboard', { title: 'ExpressAdmin' });
    }
});

module.exports = router;
