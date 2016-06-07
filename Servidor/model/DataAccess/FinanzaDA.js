// constructor del objeto
var FinanzaDA = function(){};

// instancia del schema Finanza
var Finanza = require.main.require('./model/Schemas/Finanza');

// metodo para crear una finanza en DB
FinanzaDA.prototype.Crear = function(finanzaObj, callback){
		var newFinanza = Finanza({
	  		nombrePersona: finanzaObj.nombrePersona,
	  		fchMovimiento: finanzaObj.fchMovimiento,
	  		saldoMovimiento: finanzaObj.saldoMovimiento
		});
		// save the user
		newFinanza.save(function(err) {
		  if (err) throw err;

		  callback(true);
		});
};

// metodo para edita una finanza en DB
FinanzaDA.prototype.Editar = function(finanzaObj, callback){
		// find the user with id 4
		// update username to starlord 88
		Finanza.findByIdAndUpdate(finanzaObj.id, 
			{
				nombrePersona: finanzaObj.nombrePersona,
				fchMovimiento: finanzaObj.fchMovimiento,
				saldoMovimiento: finanzaObj.saldoMovimiento
			} 
		, function(err, user) {
		  if (err) throw err;

		  // we have the updated user returned to us
		  callback(true);
		});
};

// metodo para eliminar una finanza en DB
FinanzaDA.prototype.Eliminar = function(finanzaObj, callback){
		// find the user with id 4
		Finanza.findByIdAndRemove(finanzaObj.id, function(err) {
		  if (err) throw err;

		  // we have deleted the user
		  callback(true);
		});
};

// metodo para obtener todas las finanzas en DB
FinanzaDA.prototype.GetAll = function(callback){
		// get all the users
		Finanza.find({}, function(err, finanzas) {
		  if (err) throw err;

		  // object of all the users
		  callback(finanzas);
		});
};

// metodo para obtener una lista de finanzas por un filtro determinado
FinanzaDA.prototype.GetByFiltro = function(finanzaObj, callback){
		// get all the users
		var ObjectId = require('mongoose').Types.ObjectId; 
		Finanza.find({ _id: new ObjectId(finanzaObj._id) }, 
			function(err, finanzas) {
			  if (err) throw err;

			  // object of all the users
			  callback(finanzas);
		});
};

module.exports = new FinanzaDA();