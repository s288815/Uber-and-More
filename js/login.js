import {login} from './modules/api.js';

// Shorthand for ONLOAD, same as $(document).ready(...);
$(function(){

	$('#loginBtn').on('click', function(){
		let info = $('#loginForm').serialize();
		
		login(info).then((data)=>{
			// Redirect user to their page according to their role
			let role = (data.userType == 1)? 'driver': 'rider';
			location.href = `${ globalVar.baseURI || document.baseURI }${role}`;
		});
	});

});