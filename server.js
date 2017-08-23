var express = require('express');
var cors = require('cors')
var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
var bodyParser = require('body-parser')

var app = express();
app.use(cors())

mongoose.connect('mongodb://charles:controleacesso@ds062448.mlab.com:62448/controle_acesso');

var port = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var user = mongoose.Schema({
  id: Number,
  usuario: String,
  "data_acesso": Date
});
user.plugin(AutoIncrement, {inc_field: 'id'});
var User = mongoose.model('User', user);

app.post('/controle_acesso', function (req, res, next) {
  console.log(req.body);

  var d = new Date();
  if(req.body.data_acesso){
    new Date(req.body.data_acesso);
  }

  var newuser = new User({
    id: 1,
    usuario: req.body.usuario,
    "data_acesso": d
  });

  newuser.save(function (err, user) {
    if (err) return console.error(err);
    res.send(user);
  });
});

app.get('/controle_acesso', function (req, res, next) {
  User.find(function (err, users) {
    if (err) return console.error(err);
    res.send(users);
  })
});

db.once('open', function() {
  app.listen(port, function () {
    console.log('Example app listening on port 3000!');
  });
});