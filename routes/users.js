var express = require('express');
var crypto = require('crypto');
var session = require('express-session');
var connection = require('./cfg/db');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/login', function(req, res, next) {
  if(typeof req.session.username === 'undefined'){
    res.render('user/login');
  } else {
    res.redirect('/admin');
  }
  res.end();
});

router.get('/register', function(req, res, next) {
  res.render('user/register');
});
router.post('/register', function(req, res) {
  // var first_name = req.body.first_name;
  // var last_name  = req.body.last_name;
  // var email  = req.body.email;
  // var username   = req.body.username;
  // var password   = crypto.createHash('md5').update(req.body.password).digest("hex");
  var today = new Date();
  var users={
    "first_name":req.body.first_name,
    "last_name":req.body.last_name,
    "email":req.body.email,
    "username":req.body.username,
    "password":crypto.createHash('md5').update(req.body.password).digest("hex"),
    "created":today,
    "modified":today
  }

  if (users.username && users.password) {
    // connection.query('INSERT INTO `users` (`first_name`, `last_name`, `email`, `username`, `password`) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, email, username, password], function(error) {
      connection.query('INSERT INTO `users` SET ? ', users, function (error, results, fields) {
      if (error) {
        console.log(error.message);
        res.end();
      } else {
        res.statusCode = 200;
        res.redirect('/users/login');
      }
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

router.get('/profile', function(req, res, next) {
  res.render('user/profile');
});

router.post('/auth', function(req, res, next) {
  var username = req.body.username;
  var password = crypto.createHash('md5').update(req.body.password).digest("hex");
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.username = username;
				res.redirect('/admin');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }

})

module.exports = router;
