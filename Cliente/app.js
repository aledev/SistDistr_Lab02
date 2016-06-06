// Obtenemos la referencia del modulo express
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
// Obtenemos la referencia del modulo logger morgan
var logger = require('morgan');
// Obtenemos la referencia del modulo body-parser
var bodyParser 	= require('body-parser');
// Obtenemos la refencia del modulo request para realizar peticiones
// REST a traves de nodejs
var request = require('request');
// Obtenemos la referencia del modulo socket.io-client
var io = require('socket.io-client');
// Obtenemos la referencia del modulo de encriptación
var crypto = require('crypto');
// Obtenemos la referencia del modulo para manipular cookies
var cookieParser = require('cookie-parser');
// Obtenemos la referencia del modulo para manipular sesiones de express
var expressSession = require('express-session');
// Obtenemos la referencia del helper para los logs de socket.io del cliente
var loggerHelper = require('./js/LoggerHelper');
// Generamos la sal
var salt = 'l4ab02$altP4$$wørD';
// Palabra secreta de la cookie actual
var cookieSecret = 'l4ab02cøøki3!';
// Guardamos la dirección del servidor
var serverUrl = 'http://localhost:8080';
// Iniciamos el socket con el servidor a traves de socket.io
var socket = io.connect(serverUrl, { 'forceNew': true });
// Puerto del servidor actual
var port = 3000;
// instancia de express
var app = express();

function compile(str, path) {
	return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

socket.on('logs', function(data) {  
    loggerHelper.RenderLogMessages(data);
});

app.use(express.static(__dirname + '/public'))
// support json encoded bodies
app.use(bodyParser.json()); 
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
// support cookies
app.use(cookieParser());
app.use(expressSession({secret: cookieSecret}));

function errorSistema(req, res, msgError){
  res.render('error',
	  { 
	  	title : 'Error de Sistema',
	  	pageTitle: 'Error de Sistema',
	  	detalleError: msgError
	  }
  );
}

// *******************
// *** Modulo: Sistema
// Ruta del Login
app.get('/', function (req, res) {
  res.render('index',
	  { title : 'Inicio de Sesión',
	  	pageTitle: 'Inicio de Sesión' 
	  }
  )
});
// Evento Post del Login
app.post('/logon', function(req,res){
  try {
  	  // Hash the password with the salt
  	  var passAndSalt = salt + req.body.password;
  	  var hashedPass = crypto.createHash('sha256').update(passAndSalt).digest('base64');

	  request.post({
		  	headers: { 
		  		'content-type' : 'application/x-www-form-urlencoded'
		  	},
		  	url: serverUrl + '/logon',
			form: { 
				username: req.body.username,
				password: hashedPass 
			},
			json: true
		}, 
		function(error, response, body){
		  if(error != null){
  			errorSistema(req, res, "Ha ocurrido un error en el servidor :(");
		  } 
		  else{
		  	if(body.length > 0){
			  	req.session.currentUser = body[0];
			  	loggerHelper.AddLog('Usuario: ' + body[0].username + ' ha ingresado al sistema!');
			  	 res.render('home/home',
					  { title : 'Home - Lab02',
					  	pageTitle: 'Página de Inicio',
					  	menuItemList: [{ descripcion : "Usuarios", url : "/usuario/lista" }],
					  	logoutUrl: '/logout',
					  	username: body[0].username
					  }
				  );
		  	}
		  	else{
		  		 res.render('index',
					  	{  title : 'Inicio de Sesión',
	  					   pageTitle: 'Inicio de Sesión',
	  					   errorMessage: 'Usuario y/o Contraseña incorrectos'
	  					}
				  );
		  	}
		  }
		  //console.log("status: " + response.statusCode + ", body: " + body);
		});	
	}
	catch(error){
		errorSistema(req, res, error.message);
	}
});

// ********************
// *** Modulo: Usuarios
// Ruta de la Creación de Usuarios
app.get('/usuario/crear', function (req, res) {
  res.render('usuario/crear',
	  { title : 'Crear Usuario',
	  	pageTitle: 'Ingresar Datos Usuario' 
	  }
  )
});
// Evento Post de la Creación de Usuarios
app.post('/usuario/crearNuevo', function(req,res){
  try{
	  // Hash the password with the salt
	  var passAndSalt = salt + req.body.password;
	  var hashedPass = crypto.createHash('sha256').update(passAndSalt).digest('base64');
	  var username = req.body.username;
	  var nombre = req.body.nombre;
	  var role = req.body.role;

	  request.post({
		  	headers: { 
		  		'content-type' : 'application/x-www-form-urlencoded'
		  	},
		  	url: serverUrl + '/usuario/createUser',
			form: { 
				username: username,
				password: hashedPass,
				nombre: nombre,
				role: role
			},
			json: true
		}, 
		function(error, response, body){
		  if(error != null){
		  	errorSistema(req, res, "Ha ocurrido un error en el servidor :(");
		  }
		  else{		  	
		  	res.render('usuario/crear',
		  		 { 	title : 'Crear Usuario',
	  				pageTitle: 'Ingresar Datos Usuario' 
				  }
		  	);

		  	loggerHelper.AddLog('Se ha creado un usuario en sistema!');
		  }
		  //console.log("status: " + response.statusCode + ", body: " + body);
		});	
 	}
 	catch(error){
 		errorSistema(req, res, error.message);
 	}
});
// Ruta de la Lista de Usuarios
app.get('/usuario/lista', function (req, res) {
   try{
	   request.post({
			  	headers: { 
			  		'content-type' : 'application/x-www-form-urlencoded'
			  	},
			  	url: serverUrl + '/usuario/list',			
			  	json: true
			}, 
			function(error, response, body){
			  if(error != null) {
			  	errorSistema(req, res, "Ha ocurrido un error en el servidor :(");
			  }
			  else {
			  	  console.log(body);
			  	  res.render('usuario/lista',
					  { title : 'Lista de Usuarios',
					  	pageTitle: 'Lista de Usuarios',
					  	userObjList: body
					  }
		  		  );
			  }
			  //console.log("status: " + response.statusCode + ", body: " + body);
		});	
	}
	catch(error){
		errorSistema(req, res, error.message);
	}
});

// **************************
// Manejo de Paginas de Error
// catch 404 and forward to error handler
app.get('*', function(req, res){
  res.render('error',
	  { title : 'Error de Sistema',
	  	pageTitle: 'Error de Sistema',
	  	detalleError: "Pagina No Encontrada!"
	  }
  )
});

app.listen(port)
console.log('Cliente Node.js iniciado en puerto: ' + port);