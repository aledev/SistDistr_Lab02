var MenuHelper = function(){};
var io = require('socket.io-client');

MenuHelper.prototype.BuildMenu = function (req) {  
	var menuListItem = Array();

	menuListItem.push({
		descripcion : 'Inicio',
		url : '/home/home'
	})

    if(req.session.currentUser.role == 'administrador'){
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
    else if(req.session.currentUser.role == 'finanza'){
		menuListItem.push({
			descripcion : 'Finanzas',
			url : '/finanza/lista'
		});
    }
    else if(req.session.currentUser.role == 'recursohumano'){
    	menuListItem.push({
			descripcion : 'Recursos Humanos',
			url : '/recursohumano/lista'
		});
    }

    return menuListItem;
};

MenuHelper.prototype.CheckCurrentPagePermission = function (req, res, page) {  
	var result = true;

	if(req.session.currentUser.role == 'finanza'){
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
	else if(req.session.currentUser.role == 'recursohumano'){
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
