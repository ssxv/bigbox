// Setup basic express server
var express = require('express');
var bodyParser= require('body-parser')
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

app.get('/', function (request, response) {
	response.sendFile(__dirname + "/index.html")
})

// MongoDB Driver Setup 
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
// Connection URL
var url = 'mongodb://localhost:27017/bigbox';

app.use(bodyParser.urlencoded({extended: true}));

app.post('/upload', (request, response) => {
	console.log(request.body.score);
	var data = '{"score":'+ request.body.score +',"name":"'+ request.body.name +'"}';
	console.log(data);	
	MongoClient.connect(url, (err, database) => {
		if (err) return console.log(err)
		database.collection('score').insertOne(JSON.parse(data), function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);
			database.close();
			console.log("saved to database")
			response.redirect('/')
		});
	})
})

app.get('/getscore', function (request, response) {
	MongoClient.connect(url, (err, database) => {
		if (err) return console.log(err)
		database.collection('score').find().sort({"score":-1}).limit(20).toArray(function(err, results) {
			database.close();
			console.log(results);
			response.json(results);
		})
	})
})