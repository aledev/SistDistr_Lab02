// constructor del objeto
var UsuarioDA = function(){};

// instancia del schema Usuario
var Usuario = require.main.require('./model/Schemas/Usuario');

UsuarioDA.prototype.ValidarUsuario = function(login, password, callback){
		// obtenemos el usuario por login y password
		Usuario.find({ username: login, password: password }, 
		function(err, user) {
	  		if (err) throw err;
	  		// object of the user
	  		callback(user);
		});
};

UsuarioDA.prototype.CrearUsuario = function(username, password, nombre, role, callback){
		var newUsuario = Usuario({
		 	username: username,
		 	password: password,
		 	nombre: nombre,
		 	role: role
		});
		// save the user
		newUsuario.save(function(err) {
		  if (err) throw err;

		  callback(true);
		});
};

UsuarioDA.prototype.GetAll = function(callback){		
		// save the user
		Usuario.find({}, 
		function(err, list) {
		  if (err) throw err;
		  
		  callback(list);
		});
};

module.exports = new UsuarioDA();
	