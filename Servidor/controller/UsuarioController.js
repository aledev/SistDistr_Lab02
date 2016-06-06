// constructor del objeto
var UsuarioController = function(){};
// namespace del objeto
var cPrefix = "model.DataAccess.UsuarioController";
// instancia del dataaccess UsuarioDA
var usuarioDA = require.main.require('./model/DataAccess/UsuarioDA');

UsuarioController.prototype.Login = function(user, pass){
	var mPrefix = "[Login]";

	var usuarioObj = null;

	try{
		usuarioObj = usuarioDA.ValidarUsuario(user, pass);
	}
	catch(err){
		console.log(cPrefix + mPrefix + "=> Error. Detalle: " + err.message);
		throw err;
	}

	return usuarioObj;
};
	
UsuarioController.prototype.Crear = function(username, password, nombre, role){
	var mPrefix = "[Crear]";

	var resultObj = false;

	try{
		resultObj = usuarioDA.CrearUsuario(username, password, nombre, role);
	}
	catch(err){
		console.log(cPrefix + mPrefix + "=> Error. Detalle: " + err.message);
		throw err;
	}

	return resultObj;
};

UsuarioController.prototype.Lista = function(callback){
	var mPrefix = "[Lista]";

	try{
		usuarioDA.GetAll(function(data){
			resultObj = data;	
			console.log(cPrefix + mPrefix + "=>Detalle: " + resultObj);
			callback(resultObj);
		});
	}
	catch(err){
		console.log(cPrefix + mPrefix + "=> Error. Detalle: " + err.message);
		throw err;
	}
};

module.exports = new UsuarioController();