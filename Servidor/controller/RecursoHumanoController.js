// constructor del objeto
var RecursoHumanoController = function(){};
// namespace del objeto
var cPrefix = "controller.RecursoHumanoController";
// instancia del dataaccess UsuarioDA
var rrhhDA = require.main.require('./model/DataAccess/RecursoHumanoDA');
	
RecursoHumanoController.prototype.Crear = function(rrhhObj, callback){
	var mPrefix = "[Crear]";

	var resultObj = false;

	try{
		rrhhDA.Crear(rrhhObj, function(data){
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

RecursoHumanoController.prototype.Editar = function(rrhhObj, callback){
	var mPrefix = "[Crear]";

	var resultObj = false;

	try{
		rrhhDA.Crear(rrhhObj, function(data){
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

RecursoHumanoController.prototype.Lista = function(callback){
	var mPrefix = "[Lista]";

	try{
		rrhhDA.GetAll(function(data){
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

module.exports = new RecursoHumanoController();