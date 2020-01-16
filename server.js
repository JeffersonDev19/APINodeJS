var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true 
}));
app.get('/', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.send({ error: true, message: 'caminho inexistente'});
});
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});

var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'user',
    database: 'dinamicatreinamentos'
});
// connect to database
dbConn.connect(); 

app.get('/users', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    dbConn.query('SELECT * FROM usuario', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'lista de usuário' });
    });
});

app.post('/users', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let user = req.body.user;
    let idade = req.body.idade;
    let telefone = req.body.telefone;
    if (!user) {
      return res.status(400).send({ error:true, message: 'Processo inválido' });
    }
   dbConn.query("INSERT INTO usuario SET ?, ?, ?", { user:user, idade:idade, telefone:telefone }, function (error, results, fields) {
  if (error) throw error;
    return res.send({ error: false, data: results, message: 'Novo usuário cadastrado!' });
    });
});

app.put('/users', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let user_id = req.body.user_id;
    let user = req.body.user;
    if (!user_id || !user) {
      return res.status(400).send({ error: user, message: 'Processo inválido' });
    }
    dbConn.query("UPDATE usuario SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
      if (error) throw error;
      return res.send({ error: false, data: results, message: 'Usuário atualizado com sucesso' });
     });
});

app.delete('/users', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    let user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Processo inválido' });
    }
    dbConn.query('DELETE FROM usuario WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Usuário deletado com sucesso' });
    });
});

module.exports = app;