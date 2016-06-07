// creamos las variables que necesitaremos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// creamos el "schema"
var finanzaSchema = new Schema({
  nombrePersona: String,
  fchMovimiento: Date,
  saldoMovimiento: Number
});

// el "schema" es inservible aún...
// necesitamos crear un modelo para utilizarlo
var Finanza = mongoose.model('finanza', finanzaSchema);

// dejamos esto disponible para la aplicación nodejs
module.exports = Finanza;