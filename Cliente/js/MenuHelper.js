var MenuHelper = function(){};

// Referencias 
var io = require('socket.io-client');

MenuHelper.prototype.BuildMenu = function (sessionObj) {  
	var menuListItem = Array();

	menuListItem.push({
		descripcion : 'Inicio',
		url : '/home/home'
	})

	try {
		if(sessionObj != null){
		    if(sessionObj.role == 'administrador'){
				menuListItem.push({
					descripcion : 'Usuarios',
					url : '/usuario/lista'
				});
				menuListItem.push({
					descripcion : 'Finanzas',
					url : '/finanza/lista'
				});
				menuListItem.push({
					descripcion : 'Recursos Humanos',
					url : '/recursohumano/lista'
				});
		    }
		    else if(sessionObj.role == 'finanza'){
				menuListItem.push({
					descripcion : 'Finanzas',
					url : '/finanza/lista'
				});
		    }
		    else if(sessionObj.role == 'recursohumano'){
		    	menuListItem.push({
					descripcion : 'Recursos Humanos',
					url : '/recursohumano/lista'
				});
		    }
		}
	}
	catch(error){
		console.log('Error, detalle: ' + error.message);
	}

    return menuListItem;
};

MenuHelper.prototype.CheckCurrentPagePermission = function (sessionObj, res, page) {  
	var result = true;

	try {
		if(sessionObj != null){
			if(!page.startsWith('/home')){
				if(sessionObj.role == 'finanza'){
					if(!page.startsWith('/finanza')){
						res.render('error',
						  { 
						  	title : 'Error de Sistema',
						  	pageTitle: 'Error de Sistema',
						  	detalleError: 'No tiene permisos para ver la página actual'
						  }
					  	);

					  	result = false;
					}
				}
				else if(sessionObj.role == 'recursohumano'){
					if(!page.startsWith('/recursohumano')){
						res.render('error',
						  { 
						  	title : 'Error de Sistema',
						  	pageTitle: 'Error de Sistema',
						  	detalleError: 'No tiene permisos para ver la página actual'
						  }
						);	

						result = false;
					}		
				}
			}
		}
		else{
			res.render('error',
			  { 
			  	title : 'Sesión Finalizada',
			  	pageTitle: 'Sesión Finalizada',
			  	detalleError: 'Se ha expirado la sesión actual!'
			  }
			);	

			result = false;
		}
	}
	catch(error){
		console.log('Error, detalle: ' + error.message + '\n' + 'Session: ' + sessionObj);
	}

	return result;
};

MenuHelper.prototype.ErrorSistema = function (req, res, msgError){
	  res.render('error',
		  { 
		  	title : 'Error de Sistema',
		  	pageTitle: 'Error de Sistema',
		  	detalleError: msgError
		  }
	  );
};

MenuHelper.prototype.RedirectPage = function (page, req, res, msgError){
	  res.render(page,
		  { 
		  	title : 'Error de Sistema',
		  	pageTitle: 'Error de Sistema',
		  	errorMessage: msgError
		  }
	  );
};

MenuHelper.prototype.RedirectPageOk = function (page, title, pageTitle, req, res, msgError){
	  res.render(page,
		  { 
		  	title : title,
		  	pageTitle: pageTitle,
		  	errorMessage: msgError,
	  		menuItemList: this.BuildMenu(req.session.currentUser),
	  		logoutUrl: '/logout',
		  	username: req.session.currentUser.username 
		  }
	  );
};

MenuHelper.prototype.DestroySession = function (req, res, logger){
	if(req.session.currentUser != null){
  		var username = req.session.currentUser.username;
  		logger.AddLog(username, 'Ha salido del sistema');
	}

	req.session.destroy();
	res.render('index',
	  { title : 'Inicio de Sesión',
	  	pageTitle: 'Inicio de Sesión' 
	  }
  	);
};

module.exports = new MenuHelper();
