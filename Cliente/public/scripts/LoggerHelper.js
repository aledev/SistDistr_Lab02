var LoggerHelper = function(){};

// Guardamos la dirección del servidor
var serverUrl = 'http://localhost:8080';
// Iniciamos el socket con el servidor a traves de socket.io
var socket = io.connect(serverUrl, { 'forceNew': true });

LoggerHelper.prototype.AddLog = function (user, action) {  
    var log = {
	    user: user,
	    action: action
  	};

  	socket.emit('new-log', JSON.stringify(log));
};

LoggerHelper.prototype.RenderLogMessages = function (data) {  	
	var jsonData = JSON.parse(data);
    var html = '<span>Usuario: ' + jsonData.user + ', ' + jsonData.action + '</span><br/>';
    $('#divLogs').prepend(html);
};

LoggerHelper.prototype.SocketRef = function(){
	return socket;
};

