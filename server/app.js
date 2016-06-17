var express=require('express');  // sets up express
var app=express();
var path=require('path');  // sets up paths
var bodyParser=require('body-parser');  // sets up body-parser for POST method
var urlencodedParser=bodyParser.urlencoded( {extended: false} );
var pg=require('pg');  // sets up postgres database
var connectionString='postgres://localhost:5432/assessment2';
var random=require('../modules/random.js');  // sets up random number module

app.get('/', function(req, res) {  // sets up base url
  console.log('hello from base url get');
  res.sendFile(path.resolve('views/index.html')); // sends the index.html file to the browser!!!!!!!!!!!
});

app.get('/getList', function(req, res) { // displaying the animal list - uses GET
  console.log("in app.get get list animals");
  var results = [];  // array to hold animals
  pg.connect(connectionString, function(err, client, done) {  // connecting to assessment2 database
    var animalList=client.query('SELECT animal, animal_num FROM animals;');  // getting animal and animal_num from animals table
    console.log('query '+ animalList);
    var rows = 0;
    animalList.on('row', function(row) {  // pushing to array
      results.push(row);
    });  // end query push
    animalList.on('end', function() {  // sending to scripts
      return res.json(results);
    });
  });
  });

app.post('/addAnimal',urlencodedParser, function(req, res) {  // adding animal to database
  var newAnimal = req.body.animal + req.body.animal_num;
  res.send(newAnimal);
  pg.connect(connectionString, function(err, client, done) {
    client.query('INSERT INTO animals(animal, animal_num) VALUES($1, $2)', [req.body.animal, req.body.animal_num]);
    }); // end database connection
    // var fromModule=random(req.body);        // tried here to append animal to list but failed
    // res.send(fromModule);
    // res.end();
  }); // end add product post function

app.listen(3000, 'localhost', function(req, res) {  // spin up port
  console.log("listening on port 3000");
});

app.use(express.static('public')); // makes public folder available
