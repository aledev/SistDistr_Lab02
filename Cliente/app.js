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
// Obtenemos la referencia del helper la construcción del ambiente de acuerdo al rol del usaurio
var menuHelper = require('./js/MenuHelper');
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
// Instancia del modulo moment
app.locals.moment = require('moment');

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

app.use(express.static(__dirname + '/public'))
// support json encoded bodies
app.use(bodyParser.json()); 
// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
// support cookies
app.use(cookieParser());
sessionStore = new expressSession.MemoryStore();
app.use(expressSession({secret: cookieSecret, store: sessionStore}));


// *******************
// *** Modulo: Sistema
// Ruta del Login
app.get('/', function (req, res) {
	try{
	  res.render('index',
		  { title : 'Inicio de Sesión',
		  	pageTitle: 'Inicio de Sesión' 
		  }
	  )
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});
// Evento Post del Login
app.post('/logon', function(req, res){
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
  			menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
		  } 
		  else{
		  	if(body.length > 0){
			  	req.session.currentUser = body[0];
			  	// Agregamos un log de acción
			  	loggerHelper.AddLog(body[0].username, 'Ha iniciado sesión');
		  	 	res.render('home/home',
					  { title : 'Home - Lab02',
					  	pageTitle: 'Página de Inicio',
					  	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
					  	logoutUrl: '/logout',
					  	username: body[0].username
					  }
	  			);
		  	}
		  	else{
		  		menuHelper.RedirectPage('index', req, res, 'Usuario y/o Contraseña incorrectos');		  		 
		  	}
		  }
		});	
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});
// Rutal del Home
app.get('/home/home', function(req, res){
	try{
		if(menuHelper.CheckCurrentPagePermission(req.session.currentUser, res, '/home/home')){
			res.render('home/home',
				  { title : 'Home - Lab02',
				  	pageTitle: 'Página de Inicio',
				  	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
				  	logoutUrl: '/logout',
				  	username: req.session.currentUser != null ? req.session.currentUser.username : ''
				  }
			  );
		}
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
})
// Ruta del Logout
app.get('/logout', function (req, res) {
	try{
		menuHelper.DestroySession(req, res, loggerHelper);
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});


// ********************
// *** Modulo: Usuarios
// Ruta de la Creación de Usuarios
app.get('/usuario/crear', function (req, res) {
	try{
		if(menuHelper.CheckCurrentPagePermission(req.session.currentUser, res, '/usuario/crear')){
		  res.render('usuario/crear',
			  { title : 'Crear Usuario',
			  	pageTitle: 'Ingresar Datos Usuario',
			  	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
			  	logoutUrl: '/logout',
			  	username: req.session.currentUser.username 
			  }
		  )
		}
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});
// Evento Post de la Creación de Usuarios
app.post('/usuario/crearNuevo', function(req, res){
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
		  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
		  }
		  else{		  	
		  	if(body== true){
	  			menuHelper.RedirectPageOk('usuario/crear', 'Crear Usuario', 'Ingresar Datos Usuario', 
					req, res, 'El usuario se ha creado satisfactoriamente');

			  	// Agregamos un log de acción
			  	loggerHelper.AddLog(req.session.currentUser.username, 'Ha creado un usuario');
			  }
			else {
				menuHelper.RedirectPageOk('usuario/crear', 'Crear Usuario', 'Ingresar Datos Usuario', 
					req, res, 'No se ha podido crear el usuario');
			}			
		  }
		});	
 	}
 	catch(error){
 		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
 	}
});
// Ruta de la Lista de Usuarios
app.get('/usuario/lista', function (req, res) {
   try{
	   	if(menuHelper.CheckCurrentPagePermission(req, res, '/usuario/crear')){
		   request.post({
				  	headers: { 
				  		'content-type' : 'application/x-www-form-urlencoded'
				  	},
				  	url: serverUrl + '/usuario/list',			
				  	json: true
				}, 
				function(error, response, body){
				  if(error != null) {
				  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
				  }
				  else {
				  	  res.render('usuario/lista',
						  { title : 'Lista de Usuarios',
						  	pageTitle: 'Lista de Usuarios',
						  	userObjList: body,
					  	 	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
		  					logoutUrl: '/logout',
		  					username: req.session.currentUser.username 
						  }
			  		  );
				  }
			});	
		}
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});


// ********************
// *** Modulo: Finanzas
// Ruta de la Creación de Finanzas
app.get('/finanza/crear', function (req, res) {
	try{
		if(menuHelper.CheckCurrentPagePermission(req.session.currentUser, res, '/finanza/crear')){
		  res.render('finanza/crear',
			  { title : 'Crear Finanza',
			  	pageTitle: 'Ingresar Datos Finanza',
			  	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
			  	logoutUrl: '/logout',
			  	username: req.session.currentUser.username 
			  }
		  )
		}
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});
// Evento Post de la Creación de Finanzas
app.post('/finanza/crearNuevo', function(req, res){
  try{
	  request.post({
		  	headers: { 
		  		'content-type' : 'application/x-www-form-urlencoded'
		  	},
		  	url: serverUrl + '/finanza/crear',
			form: { 
				nombrePersona: req.body.nombrePersona,
				fchMovimiento: req.body.fchMovimiento,
  				saldoMovimiento: req.body.saldoMovimiento
			},
			json: true
		}, 
		function(error, response, body){
		  if(error != null){
		  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
		  }
		  else{		  	
		  	console.log('respuesta body: ' + body);
		  	if(body == true){
	  			res.status(302).redirect("/finanza/lista");
			  	// Agregamos un log de acción
			  	loggerHelper.AddLog(req.session.currentUser.username, 'Ha creado una finanza');
			  }
			else {
				menuHelper.RedirectPageOk('finanza/crear', 'Crear Finanza', 'Ingresar Datos Finanza', 
					req, res, 'No se ha podido crear la finanza');
			}			
		  }
		});	
 	}
 	catch(error){
 		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
 	}
});
// Ruta de la Lista de Finanzas
app.get('/finanza/lista', function (req, res) {
   try{
	   	if(menuHelper.CheckCurrentPagePermission(req.session.currentUser, res, '/finanza/lista')){
		   request.post({
				  	headers: { 
				  		'content-type' : 'application/x-www-form-urlencoded'
				  	},
				  	url: serverUrl + '/finanza/lista',			
				  	json: true
				}, 
				function(error, response, body){
				  if(error != null) {
				  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
				  }
				  else {
				  	  res.render('finanza/lista',
						  { title : 'Lista de Finanzas',
						  	pageTitle: 'Lista de Finanzas',
					  	 	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
		  					logoutUrl: '/logout',
		  					username: req.session.currentUser.username,
		  					finanzaObjList: body
						  }
			  		  );
				  }
			});	
		}
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});
// Ruta de la Edición de Finanzas
app.get('/finanza/editar', function (req, res) {
	try {
		if(menuHelper.CheckCurrentPagePermission(req.session.currentUser, res, '/finanza/editar')){
			 request.post({
				  	headers: { 
				  		'content-type' : 'application/x-www-form-urlencoded'
				  	},
				  	url: serverUrl + '/finanza/findById',		
				  	form: { 
						id: req.query.id
					},	
				  	json: true
				}, 
				function(error, response, body){
				  if(error != null) {
				  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
				  }
				  else {
			  		   res.render('finanza/editar',
						  { title : 'Editar Finanza',
						  	pageTitle: 'Editar Finanza',
						  	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
						  	logoutUrl: '/logout',
						  	username: req.session.currentUser.username,
						  	datosObj: body[0]
						  }
					  );
				  }
			});	
		}
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});
// Evento Post de la Edición de Finanzas
app.post('/finanza/editarDato', function(req, res){
  try{
  	  var idFinanza = req.body.id;

	  request.post({
		  	headers: { 
		  		'content-type' : 'application/x-www-form-urlencoded'
		  	},
		  	url: serverUrl + '/finanza/editar',
			form: { 
				id: req.body.id,
				nombrePersona: req.body.nombrePersona,
				fchMovimiento: req.body.fchMovimiento,
  				saldoMovimiento: req.body.saldoMovimiento
			},
			json: true
		}, 
		function(error, response, body){
		  if(error != null){
		  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
		  }
		  else{		  	
		  	console.log('respuesta body: ' + body);
		  	if(body == true){
	  			res.status(302).redirect("/finanza/lista");
			  	// Agregamos un log de acción
			  	loggerHelper.AddLog(req.session.currentUser.username, 'Ha editado una finanza');
			  }
			else {
				menuHelper.RedirectPageOk('finanza/editar?id=' + idFinanza, 'Editar Finanza', 'Editar Finanza', 
					req, res, 'No se ha podido editar la finanza');
			}			
		  }
		});	
 	}
 	catch(error){
 		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
 	}
});
// Ruta de la Eliminación de Finanzas
app.get('/finanza/eliminar', function (req, res) {
	try {
		if(menuHelper.CheckCurrentPagePermission(req.session.currentUser, res, '/finanza/eliminar')){
			 request.post({
				  	headers: { 
				  		'content-type' : 'application/x-www-form-urlencoded'
				  	},
				  	url: serverUrl + '/finanza/findById',	
				  	form: { 
						id: req.query.id
					},			
				  	json: true
				}, 
				function(error, response, body){
				  if(error != null) {
				  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
				  }
				  else {
			  		   res.render('finanza/eliminar',
						  { title : 'Eliminar Finanza',
						  	pageTitle: 'Eliminar Finanza',
						  	menuItemList: menuHelper.BuildMenu(req.session.currentUser),
						  	logoutUrl: '/logout',
						  	username: req.session.currentUser.username,
						  	datosObj: body[0] 
						  }
					  );
				  }
			});	
		}
	}
	catch(error){
		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
	}
});
// Evento Post de la Eliminación de Finanzas
app.post('/finanza/eliminarDato', function(req, res){
  try{
  	  var idFinanza = req.body.id;

	  request.post({
		  	headers: { 
		  		'content-type' : 'application/x-www-form-urlencoded'
		  	},
		  	url: serverUrl + '/finanza/eliminar',
			form: { 
				id: req.body.id
			},
			json: true
		}, 
		function(error, response, body){
		  if(error != null){
		  	menuHelper.ErrorSistema(req, res, "Ha ocurrido un error en el servidor :(");
		  }
		  else{		  	
		  	console.log('respuesta body: ' + body);
		  	if(body == true){
	  			res.status(302).redirect("/finanza/lista");
			  	// Agregamos un log de acción
			  	loggerHelper.AddLog(req.session.currentUser.username, 'Ha editado una finanza');
			  }
			else {
				menuHelper.RedirectPageOk('finanza/eliminarDato?id=' + idFinanza, 'Eliminar Finanza', 'Eliminar Finanza', 
					req, res, 'No se ha podido eliminar la finanza');
			}			
		  }
		});	
 	}
 	catch(error){
 		menuHelper.ErrorSistema(req, res, 'Error no controlado. Detalle: ' + error.message);
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