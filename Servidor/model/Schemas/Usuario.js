// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var usuarioSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nombre: String,
  role: String
});

// the schema is useless so far
// we need to create a model using it
var Usuario = mongoose.model('usuario', usuarioSchema);

// make this available to our users in our Node applications
module.exports = Usuario;