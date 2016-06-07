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
// obtenemos la instancia del RecursoHumanoController
var recursoHumanoController = require('./controller/RecursoHumanoController');
// obtenemos la instancia del FinanzaController
var finanzaController = require('./controller/FinanzaController');

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

// ********************
// *** Modulo: Finanzas
// Listar
app.post('/finanza/lista', function (req, res) {
	try{
	  finanzaController.Lista(function(resData){
	  	res.json(resData);	
	  });
	}
	catch(error){
		throw error;
	}
});
// Crear 
app.post('/finanza/crear', function (req, res) {
	try{
  		var objCreate = {
		  	nombrePersona: req.body.nombrePersona,
  			fchMovimiento: req.body.fchMovimiento,
  			saldoMovimiento: req.body.saldoMovimiento
  		};

	  	finanzaController.Crear(objCreate, function(resData){
	  	var responseJson = resData;

	  	console.log(responseJson);
		res.json(responseJson);
	  });
	}
	catch(error){
		throw error;
	}
});
// Editar
app.post('/finanza/editar', function (req, res) {
	try{
  		var objEdit = {
  			id : req.body.id,
			nombrePersona: req.body.nombrePersona,
  			fchMovimiento: req.body.fchMovimiento,
  			saldoMovimiento: req.body.saldoMovimiento	
  		};

		finanzaController.Editar(objEdit, function(resData){
			var responseJson = resData;
		  	console.log(responseJson);
		  	res.json(responseJson);
	  	});
	}
	catch(error){
		throw error;
	}
});
// Eliminar
app.post('/finanza/eliminar', function (req, res) {
	try{
		var objRemove = {
  			id : req.body.id
  		};

		finanzaController.Eliminar(objRemove, function(resData){
			var responseJson = resData;
		  	console.log(responseJson);
		  	res.json(responseJson);
	  	});
	}
	catch(error){
		throw error;
	}
});
// Buscar por Id
app.post('/finanza/findById', function (req, res) {
	try{
  		var objFind = {
  			_id : req.body.id,
  		};

		finanzaController.Buscar(objFind, function(resData){
			var responseJson = resData;
		  	console.log(responseJson);
		  	res.json(responseJson);
	  	});
	}
	catch(error){
		throw error;
	}
});

// ********************
// *** Modulo: Recursos Humanos
// Listar
app.post('/recursohumano/lista', function (req, res) {
	try{
	  recursoHumanoController.Lista(function(resData){
	  	res.json(resData);	
	  });
	}
	catch(error){
		throw error;
	}
});
// Crear 
app.post('/recursohumano/crear', function (req, res) {
	try{
  		var objCreate = {
			nombrePersona : req.body.nombrePersona,
		  	fchNacimiento : req.body.fchNacimiento,
		  	direccion : req.body.direccion,
		  	comuna : req.body.comuna,
		  	region : req.body.region,
		  	email : req.body.email,
		    telefono : req.body.telefono,
		  	sexo : req.body.sexo,
		  	fchContrato : req.body.fchContrato,
		  	departamento : req.body.departamento	
  		};

	  	recursoHumanoController.Crear(objCreate, function(resData){
	  	var responseJson = resData;

	  	console.log(responseJson);
		res.json(responseJson);
	  });
	}
	catch(error){
		throw error;
	}
});
// Editar
app.post('/recursohumano/editar', function (req, res) {
	try{
  		var objEdit = {
  			id : req.body.id,
			nombrePersona : req.body.nombrePersona,
		  	fchNacimiento : req.body.fchNacimiento,
		  	direccion : req.body.direccion,
		  	comuna : req.body.comuna,
		  	region : req.body.region,
		  	email : req.body.email,
		    telefono : req.body.telefono,
		  	sexo : req.body.sexo,
		  	fchContrato : req.body.fchContrato,
		  	departamento : req.body.departamento	
  		};

		recursoHumanoController.Editar(objEdit, function(resData){
			var responseJson = resData;
		  	console.log(responseJson);
		  	res.json(responseJson);
	  	});
	}
	catch(error){
		throw error;
	}
});
// Eliminar
app.post('/recursohumano/eliminar', function (req, res) {
	try{
		var objRemove = {
  			id : req.body.id
  		};

		recursoHumanoController.Eliminar(objRemove, function(resData){
			var responseJson = resData;
		  	console.log(responseJson);
		  	res.json(responseJson);
	  	});
	}
	catch(error){
		throw error;
	}
});
// Buscar por Id
app.post('/recursohumano/findById', function (req, res) {
	try{
  		var objFind = {
  			_id : req.body.id,
  		};

		recursoHumanoController.Filtro(objFind, function(resData){
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