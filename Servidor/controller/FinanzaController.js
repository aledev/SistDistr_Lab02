// constructor del objeto
var FinanzaController = function(){};
// namespace del objeto
var cPrefix = "controller.FinanzaController";
// instancia del dataaccess UsuarioDA
var finanzaDA = require.main.require('./model/DataAccess/FinanzaDA');
	
FinanzaController.prototype.Crear = function(finanzaObj, callback){
	var mPrefix = "[Crear]";

	var resultObj = false;

	try{
		finanzaDA.Crear(finanzaObj, function(data){
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

FinanzaController.prototype.Editar = function(finanzaObj, callback){
	var mPrefix = "[Editar]";

	var resultObj = false;

	try{
		finanzaDA.Editar(finanzaObj, function(data){
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

FinanzaController.prototype.Eliminar = function(finanzaObj, callback){
	var mPrefix = "[Eliminar]";

	var resultObj = false;

	try{
		finanzaDA.Eliminar(finanzaObj, function(data){
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

FinanzaController.prototype.Lista = function(callback){
	var mPrefix = "[Lista]";

	try{
		finanzaDA.GetAll(function(data){
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

FinanzaController.prototype.Buscar = function(finanzaObj, callback){
	var mPrefix = "[Buscar]";

	try{
		finanzaDA.GetByFiltro(finanzaObj, function(data){
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

module.exports = new FinanzaController();