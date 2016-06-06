var UsuarioDA = function(){};

// instancia del schema Usuario
var Usuario = require.main.require('./model/Schemas/Usuario');

UsuarioDA.prototype.ValidarUsuario = function(login, password){
		// obtenemos el usuario por login y password
		Usuario.find({ username: login, password: password }, 
		function(err, user) {
	  		if (err) throw err;
	  		// object of the user
	  		return user;
		});
};

UsuarioDA.prototype.CrearUsuario = function(username, password, nombre, role){
		var newUsuario = Usuario({
		 	username: username,
		 	password: password,
		 	nombre: nombre,
		 	role: role
		});
		// save the user
		newUsuario.save(function(err) {
		  if (err) throw err;

		  return true;
		});
};

UsuarioDA.prototype.GetAll = function(callback){		
		// save the user
		Usuario.find({}, 
		function(err, list) {
		  if (err) throw err;
		  console.log(list);
		  callback(list);
		});
};

module.exports = new UsuarioDA();
	