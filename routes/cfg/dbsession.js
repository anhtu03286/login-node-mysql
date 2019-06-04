var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var session_connect = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'express1'
});


module.exports = session_connect;