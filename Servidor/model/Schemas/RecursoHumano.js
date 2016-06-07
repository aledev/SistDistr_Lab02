// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var recursoHumanoSchema = new Schema({
  nombrePersona: String,
  fchNacimiento: Date,
  direccion: String,
  comuna: String,
  region: String,
  email: String,
  telefono: String,
  sexo: String,
  fchContrato: Date,
  departamento: String
});

// the schema is useless so far
// we need to create a model using it
var RecursoHumano = mongoose.model('recursohumano', recursoHumanoSchema);

// make this available to our users in our Node applications
module.exports = RecursoHumano;