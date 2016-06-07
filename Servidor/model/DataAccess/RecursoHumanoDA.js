// constructor del objeto
var RecursoHumanoDA = function(){};

// instancia del schema RecursoHumano
var RecursoHumano = require.main.require('./model/Schemas/RecursoHumano');

// metodo para crear una finanza en DB
RecursoHumanoDA.prototype.Crear = function(rrhhObj, callback){
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

		  callback(true);
		});
};

// metodo para edita una finanza en DB
RecursoHumanoDA.prototype.Editar = function(rrhhObj, callback){
		// find the user with id 4
		// update username to starlord 88
		RecursoHumano.findByIdAndUpdate(rrhhObj.id, 
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
		  callback(true);
		});
};

// metodo para eliminar una finanza en DB
RecursoHumanoDA.prototype.Eliminar = function(rrhhObj, callback){
		// find the user with id 4
		RecursoHumano.findByIdAndRemove(rrhhObj.id, function(err) {
		  if (err) throw err;

		  // we have deleted the user
		  callback(true);
		});
};

// metodo para obtener todas las finanzas en DB
RecursoHumanoDA.prototype.GetAll = function(callback){
		// get all the users
		RecursoHumano.find({}, function(err, rrhhList) {
		  if (err) throw err;

		  // object of all the users
		  callback(rrhhList);
		});
};

// metodo para obtener una lista de finanzas por un filtro determinado
RecursoHumanoDA.prototype.GetByFiltro = function(rrhhObj, callback){
		var ObjectId = require('mongoose').Types.ObjectId; 
		// get all the users
		RecursoHumano.find({ _id: new ObjectId(rrhhObj._id) }, 
			function(err, rrhhList) {
			  if (err) throw err;

			  // object of all the users
			  callback(rrhhList);
		});
};

module.exports = new RecursoHumanoDA();