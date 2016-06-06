module.exports = {

// instancia del schema Finanza
var Finanza = require('./model/Schema/Finanza');

// metodo para crear una finanza en DB
Crear : function(finanzaObj){
		var newFinanza = Finanza({
	  		nombrePersona: finanzaObj.nombrePersona,
	  		fchMovimiento: finanzaObj.fchMovimiento,
	  		saldoMovimiento: finanzaObj.saldoMovimiento
		});
		// save the user
		newFinanza.save(function(err) {
		  if (err) throw err;

		  return true;
		});
	},

// metodo para edita una finanza en DB
Editar: function(finanzaObj){
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
		  return true;
		});
	},

// metodo para eliminar una finanza en DB
Eliminar: function(finanzaObj){
		// find the user with id 4
		Finanza.findByIdAndRemove(finanzaObj.id, function(err) {
		  if (err) throw err;

		  // we have deleted the user
		  return true;
		});
	},

// metodo para obtener todas las finanzas en DB
GetAll: function(){
		// get all the users
		Finanza.find({}, function(err, finanzas) {
		  if (err) throw err;

		  // object of all the users
		  return finanzas;
		});
	},

// metodo para obtener una lista de finanzas por un filtro determinado
GetByFiltro: function(finanzaObj){
		// get all the users
		Finanza.find({finanzaObj}, function(err, finanzas) {
		  if (err) throw err;

		  // object of all the users
		  return finanzas;
		});
	}
};