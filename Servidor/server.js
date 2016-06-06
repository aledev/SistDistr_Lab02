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

//Routing
app.post('/logon', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  console.log("Username: " + req.body.username);
  console.log("Password: " + req.body.password);

  var usuarioObj = usuarioController.Login(username, password);

  res.json(usuarioObj);
});

// *** Modulo: Usuarios

// Crear 
app.post('/usuario/createUser', function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var nombre = req.body.nombre;
  var role = req.body.role;

  var response = usuarioController.Crear(username, password, nombre, role);
  var responseJson = { resultado : response };

  console.log(responseJson);

  res.json(responseJson);
});

//Listar
app.post('/usuario/list', function (req, res) {
	try{
		usuarioController.Lista(function(resData){
			var responseJson = { resultado : resData };
		  	console.log(responseJson);
		  	res.json(responseJson);
	  	});
	}
	catch(error){
		throw error;
	}
});

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
    	logs.push(data);
    	io.sockets.emit('logs', data);
	});
});