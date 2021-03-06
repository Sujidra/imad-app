var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var pool = require('pg').pool;
var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
var config={
    user:'sujidrarathinavel',
    database:'sujidrarathinavel',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};
var pool = new pool(config);
app.get('/test-db',function(req,res){
    pool.query('select * from user',function(err,result)
    {
        if(err)
        {
            res.status(500).send(err.tostring())
        }else{
            res.send(JSON.stringify(result))
        }
    });
});


function hash(input,salt)
{
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return["pbkdf25sync","10000",salt,hashed.toString("hex")];
}
app.get('/hash/:input',function(req,res){
    var hashedstring=hash(req.params.input,'this is random string');
    res.send(hashedstring);
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
