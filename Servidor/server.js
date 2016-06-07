var express 	= require('express');
var app 		= express();
var http 		= require('http');
var server 		= http.createServer(app);
var io 			= require('socket.io').listen(server);
var bodyParser 	= require('body-parser');
var passport	= require('passport');
var config 		= require('./config/config');
// Generamos el puerto de conexión
var port = 8080;
// Instanciamos Mongoose 
var mongoose = require('mongoose');
mongoose.connect(config.database);

server.listen(port);
console.log('Servidor Node.js iniciado en puerto: ' + port);

// support json encoded bodies
app.use(bodyParser.json()); 
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
// agregamos el directorio de los controllers
app.use("/controller", express.static(__dirname + '/controller'));
// obtenemos la instancia del UsuarioController
var usuarioController = require('./controller/UsuarioController');

// ********************
// *** Modulo: Usuarios
// Logon Sistema
app.post('/logon', function (req, res) {
	try{
	  var username = req.body.username;
	  var password = req.body.password;
	  console.log("Username: " + req.body.username);
	  console.log("Password: " + req.body.password);

	  usuarioController.Login(username, password, function(resData){
	  	res.json(resData);	
	  });
	}
	catch(error){
		throw error;
	}
});
// Crear 
app.post('/usuario/createUser', function (req, res) {
	try{
	  var username = req.body.username;
	  var password = req.body.password;
	  var nombre = req.body.nombre;
	  var role = req.body.role;

	  usuarioController.Crear(username, password, nombre, role, function(resData){
	  	var responseJson = resData;

	  	console.log(responseJson);
		res.json(responseJson);
	  });
	}
	catch(error){
		throw error;
	}
});
// Listar
app.post('/usuario/list', function (req, res) {
	try{
		usuarioController.Lista(function(resData){
			var responseJson = resData;
		  	console.log(responseJson);
		  	res.json(responseJson);
	  	});
	}
	catch(error){
		throw error;
	}
});

// Funciones del Socket.io
io.sockets.on('connection', function (socket) { // conexion
	socket.on('initRoom', function (data) {
		console.log("Entro al chat");
		socket.join();
	});

	socket.on('disconnect', function () {
		console.log("Usuario desconectado");
	});
	
	socket.on('broadcast', function (data) {
		console.log("Un usuario envió el mensaje: " + data.text);
		socket.broadcast.emit('broadcastCallback', { text:data.text});
	});

	socket.on('new-log', function(data) {  
		console.log(data);
    	//logs.push(data);
    	io.sockets.emit('message', data);
	});
});