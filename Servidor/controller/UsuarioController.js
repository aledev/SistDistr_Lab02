// constructor del objeto
var UsuarioController = function(){};
// namespace del objeto
var cPrefix = "model.DataAccess.UsuarioController";
// instancia del dataaccess UsuarioDA
var usuarioDA = require.main.require('./model/DataAccess/UsuarioDA');

UsuarioController.prototype.Login = function(user, pass, callback){
	var mPrefix = "[Login]";

	var usuarioObj = null;

	try{
		usuarioDA.ValidarUsuario(user, pass, function(data){
			usuarioObj = data;
			console.log(cPrefix + mPrefix + " => Respuesta: " + usuarioObj);
			callback(usuarioObj);
		});

	}
	catch(err){
		console.log(cPrefix + mPrefix + " => Error. Detalle: " + err.message);
		throw err;
	}
};
	
UsuarioController.prototype.Crear = function(username, password, nombre, role, callback){
	var mPrefix = "[Crear]";

	var resultObj = false;

	try{
		usuarioDA.CrearUsuario(username, password, nombre, role, function(data){
			resultObj = data;
			console.log(cPrefix + mPrefix + " => Respuesta: " + usuarioObj);
			callback(resultObj);
		});
	}
	catch(err){
		console.log(cPrefix + mPrefix + " => Error. Detalle: " + err.message);
		throw err;
	}
};

UsuarioController.prototype.Lista = function(callback){
	var mPrefix = "[Lista]";

	try{
		usuarioDA.GetAll(function(data){
			resultObj = data;	
			console.log(cPrefix + mPrefix + " => Respuesta: " + resultObj);
			callback(resultObj);
		});
	}
	catch(err){
		console.log(cPrefix + mPrefix + " => Error. Detalle: " + err.message);
		throw err;
	}
};

module.exports = new UsuarioController();