
export function showOnlineIndicator() {
	$('#onlineIndicator').addClass('online');
}

export function hideOnlineIndicator() {
	$('#onlineIndicator').removeClass('online');
}



export function popShortMsg(msg = '', autoClose = 3000) {
	let toast = $('#shortMsg');
	let timeoutID = toast.data('timeout');

	// Prevent closing due to previous timeout
	if (timeoutID) {
		clearTimeout(timeoutID);
		toast.data('timeout', '');
	}

	// Need to close it then only re-show it with new message
	if(!toast.hasClass('hide')) {
		toast.addClass('hide');

		setTimeout(()=>{
			toast.html(msg)
			.removeClass('hide');
		}, 300);

	} 
	else {
		toast.html(msg)
			.removeClass('hide');
	}

	if(autoClose) {
		let id = setTimeout(()=>{
			toast.addClass('hide')
				.data('timeout', '');
		}, autoClose);

		toast.data('timeout', id);
	}
}

export function hideShortMsg() {
	let toast = $('#shortMsg');
	let timeoutID = toast.data('timeout');

	if (timeoutID) {
		clearTimeout(timeoutID);
		toast.data('timeout', '');
	}

	toast.addClass('hide');
}



export function customAlert(msg, cb) {
	if (cb) {
		return bootbox.alert(msg, cb);
	} else {
		return bootbox.alert(msg);
	}
}

export function customConfirm(msg, cb) {
	if (cb) {
		return bootbox.confirm(msg, cb);
	} else {
		return bootbox.confirm(msg);
	}
}

export function customPrompt(msg, cb) {
	if (cb) {
		return bootbox.prompt(msg, cb);
	} else {
		return bootbox.confirm(msg);
	}
}

export function customDialog(options) {
	return bootbox.dialog(options);
}


/*
export function showAppInputBar() {
	$('#appInputBar').fadeIn();
}

export function hideAppInputBar() {
	$('#appInputBar').fadeOut();
}

export function getAppInputVal() {
	$('#appInput').val();
}
*/




// FOR DRIVER
export function enableOnlineBtn() {
	$('#onlineBtn').prop('disabled', false);
}

export function disableOnlineBtn() {
	$('#onlineBtn').prop('disabled', true);
}

export function changeOnlineBtn(txt, status = '', classToAdd = '', classToRemove = '') {
	$('#onlineBtn').addClass(classToAdd)
		.removeClass(classToRemove)
		.html(txt)
		.data('status', status);	
}



// FOR RIDER
export function enableRequestBtn() {
	$('#requestBtn').prop('disabled', false);
}

export function disableRequestBtn() {
	$('#requestBtn').prop('disabled', true);
}

export function changeRequestBtn(txt, status = '', classToAdd = '', classToRemove = '') {
	$('#requestBtn').addClass(classToAdd)
		.removeClass(classToRemove)
		.html(txt)
		.data('status', status);	
}
