var express = require('express')
var app = express()
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
var session = require('express-session')
app.use(bodyParser.urlencoded({extended: false}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
var mysql = require('mysql');
var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');

var sequelize = new Sequelize('auth2_db', 'root');

var PORT = process.env.NODE_ENV || 8090;


var Message = sequelize.define('Message', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 15],
        msg: "Please enter a name that isn't too long"
      },
      is: ["^[a-z]+$",'i']
    }
  },
  password: {
    type: Sequelize.STRING,
    validate: {
      min: 8
    },
    allowNull: false
  },
});


//wolfgang's model
// var Message = sequelize.define('Message', {
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     validate: {
//       len: {
//         args: [1, 15],
//         msg: "Please enter a name that isn't too long"
//       },
//       is: ["^[a-z]+$",'i']
//     }
//   },
//   phone: {
//     type: Sequelize.INTEGER,
//     validate: {
//       isInt: true,
//     },
//     allowNull: false
//   },
//   message: {
//     type: Sequelize.TEXT,
//     validate: {
//       len: [5, 500],
//       allowNull: false
//     }
//   }
// });

app.get('/', function (req, res) {
    res.render('home', {
      msg: req.query.msg
    });
});

app.post('/message', function(req, res) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hashedPassword) {
      Message.create({
        name: req.body.name,
        password: hashedPassword
      }).then(function() {
        console.log("SAVED!");
      });
    });
  });
});


sequelize.sync();

app.listen(PORT, function(){
  console.log('Listening on %s', PORT)
})