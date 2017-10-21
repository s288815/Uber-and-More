import errorMsg from './errorMsg.json';
import * as UI from './ui';

const ErrorHandler = (()=>{
	function decode(errCode){
		let code = errCode.toString();
		return errorMsg[code];
	}

	// alert, prompt, confirmation, custom
	// (info, warning, error, success)
	function alert(errCode, callback, type = 'error') {
		let msg = decode(errCode) || errCode || '';
		UI.customAlert(msg);
	}

	return {
		decode,
		alert
	};

})();

export {ErrorHandler as default};