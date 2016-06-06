var LoggerHelper = function(){};

// Obtenemos la referencia del modulo socket.io-client
var io = require('socket.io-client');
// Guardamos la dirección del servidor
var serverUrl = 'http://localhost:8080';
// Iniciamos el socket con el servidor a traves de socket.io
var socket = io.connect(serverUrl, { 'forceNew': true });

LoggerHelper.prototype.AddLog = function (user, action) {  
    var log = {
	    user: user,
	    action: action
  	};

  	socket.emit('new-log', log);
};

LoggerHelper.prototype.RenderLogMessages = function (data) {  
    var html = data.map(function(elem, index){
        return('<div><strong>${elem.user}</strong>:<em>${elem.action}</em></div>');
    }).join(" ");

    document.getElementById('logs').innerHTML = html;
};

module.exports = new LoggerHelper();
