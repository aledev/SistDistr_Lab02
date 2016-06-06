module.exports = {

// instancia del schema RecursoHumano
var RecursoHumano = require('./model/Schema/RecursoHumano');

// metodo para crear una finanza en DB
Crear: function(rrhhObj){
		var newRRHH = RecursoHumano({
		 	nombrePersona: rrhhObj.nombrePersona,
	  		fchNacimiento: rrhhObj.fchNacimiento,
		  	direccion: rrhhObj.direccion,
		  	comuna: rrhhObj.comuna,
		  	region: rrhhObj.region,
		  	email: rrhhObj.email,
		  	telefono: rrhhObj.telefono,
		  	sexo: rrhhObj.sexo,
		  	fchContrato: rrhhObj.fchContrato,
		  	departamento: rrhhObj.departamento
		});
		// save the user
		newRRHH.save(function(err) {
		  if (err) throw err;

		  return true;
		});
	},

// metodo para edita una finanza en DB
Editar: function(rrhhObj){
		// find the user with id 4
		// update username to starlord 88
		RecursoHumano.findByIdAndUpdate(finanzaObj.id, 
			{
				nombrePersona: rrhhObj.nombrePersona,
	  			fchNacimiento: rrhhObj.fchNacimiento,
		  		direccion: rrhhObj.direccion,
		  		comuna: rrhhObj.comuna,
		  		region: rrhhObj.region,
		  		email: rrhhObj.email,
		  		telefono: rrhhObj.telefono,
		  		sexo: rrhhObj.sexo,
		  		fchContrato: rrhhObj.fchContrato,
		  		departamento: rrhhObj.departamento
			} 
		, function(err, user) {
		  if (err) throw err;

		  // we have the updated user returned to us
		  return true;
		});
	},

// metodo para eliminar una finanza en DB
Eliminar: function(rrhhObj){
		// find the user with id 4
		RecursoHumano.findByIdAndRemove(rrhhObj.id, function(err) {
		  if (err) throw err;

		  // we have deleted the user
		  return true;
		});
	},

// metodo para obtener todas las finanzas en DB
GetAll: function(){
		// get all the users
		RecursoHumano.find({}, function(err, rrhhList) {
		  if (err) throw err;

		  // object of all the users
		  return rrhhList;
		});
	},

// metodo para obtener una lista de finanzas por un filtro determinado
GetByFiltro: function(rrhhObj){
		// get all the users
		RecursoHumano.find({rrhhObj}, function(err, rrhhList) {
		  if (err) throw err;

		  // object of all the users
		  return rrhhList;
		});
	}
};