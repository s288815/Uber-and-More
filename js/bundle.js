(function () {
'use strict';

window.globalVar = window.globalVar || {};

var errorMsg = {
	"101": "Invalid username or password.",
	"-1": "Oops! Something went wrong with the system..."
};

function showOnlineIndicator() {
	$('#onlineIndicator').addClass('online');
}

function hideOnlineIndicator() {
	$('#onlineIndicator').removeClass('online');
}



function popShortMsg(msg = '', autoClose = 3000) {
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

function hideShortMsg() {
	let toast = $('#shortMsg');
	let timeoutID = toast.data('timeout');

	if (timeoutID) {
		clearTimeout(timeoutID);
		toast.data('timeout', '');
	}

	toast.addClass('hide');
}



function customAlert(msg, cb) {
	if (cb) {
		return bootbox.alert(msg, cb);
	} else {
		return bootbox.alert(msg);
	}
}

function customConfirm(msg, cb) {
	if (cb) {
		return bootbox.confirm(msg, cb);
	} else {
		return bootbox.confirm(msg);
	}
}

function customPrompt(msg, cb) {
	if (cb) {
		return bootbox.prompt(msg, cb);
	} else {
		return bootbox.confirm(msg);
	}
}

function customDialog(options) {
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
function enableOnlineBtn() {
	$('#onlineBtn').prop('disabled', false);
}

function disableOnlineBtn() {
	$('#onlineBtn').prop('disabled', true);
}

function changeOnlineBtn(txt, status = '', classToAdd = '', classToRemove = '') {
	$('#onlineBtn').addClass(classToAdd)
		.removeClass(classToRemove)
		.html(txt)
		.data('status', status);	
}



// FOR RIDER
function enableRequestBtn() {
	$('#requestBtn').prop('disabled', false);
}

function disableRequestBtn() {
	$('#requestBtn').prop('disabled', true);
}

function changeRequestBtn(txt, status = '', classToAdd = '', classToRemove = '') {
	$('#requestBtn').addClass(classToAdd)
		.removeClass(classToRemove)
		.html(txt)
		.data('status', status);	
}


var UI = Object.freeze({
	showOnlineIndicator: showOnlineIndicator,
	hideOnlineIndicator: hideOnlineIndicator,
	popShortMsg: popShortMsg,
	hideShortMsg: hideShortMsg,
	customAlert: customAlert,
	customConfirm: customConfirm,
	customPrompt: customPrompt,
	customDialog: customDialog,
	enableOnlineBtn: enableOnlineBtn,
	disableOnlineBtn: disableOnlineBtn,
	changeOnlineBtn: changeOnlineBtn,
	enableRequestBtn: enableRequestBtn,
	disableRequestBtn: disableRequestBtn,
	changeRequestBtn: changeRequestBtn
});

const ErrorHandler = (()=>{
	function decode(errCode){
		let code = errCode.toString();
		return errorMsg[code];
	}

	// alert, prompt, confirmation, custom
	// (info, warning, error, success)
	function alert(errCode, callback, type = 'error') {
		let msg = decode(errCode) || errCode || '';
		customAlert(msg);
	}

	return {
		decode,
		alert
	};

})();

let apiURL = `${(window.globalVar.baseURI || document.baseURI)}api`;

function ajax(options) {
	return new Promise((resolve, reject) => {
		$.ajax(options).done(function(res) {
			if(res.errCode == 1) {
				resolve(res.data);
			} else {
				ErrorHandler.alert(res.errCode);
				console.error(ErrorHandler.decode(res.errCode));
				reject(res.errCode);
			}
		}).fail(function(xhr, msg, err) { 
			console.error('Error: ', err);
		});
	});
}



/**
 * SHARED API
   ========================================*/

/**
 * LOGIN
 * 
 * @param reqData [FormData | Object] { username, password }
 * 
 * Expected response when sucessfully logged in: 
 * - errCode: 1
 * - role: (1 = 'driver' | 2 = 'rider') (in ['data'])
 * 
 */




function setCoords(lng, lat) {
	return ajax({
		url: `${apiURL}/setUserLastLocation/${lng}/${lat}`,
		dataType: 'json',
	});
}



/**
 * RIDER API
   ========================================*/

// return [{name, longitude, latitude, distance},{name,...}]
function nearbyDriver() {
	return ajax({
		url: `${apiURL}/getNearbyDriver`,
		dataType: 'json',
	});
}

function driverDetails(driverID) {
	return ajax({
		url: `${apiURL}/getDriverDetails/${driverID}`,
		dataType: 'json',
	});
}

function acceptRide(driverID) {
	return ajax({
		url: `${apiURL}/acceptRide/${driverID}`,
		dataType: 'json',
	});
}


// Betting
function checkBetResult(betID) {
	return ajax({
		url: `${apiURL}/getBetResult/${betID}`,
		dataType: 'json',
	});
}

function placeBet(betID, amount) {
	return ajax({
		url: `${apiURL}/placeBet/${betID}/${amount}`,
		dataType: 'json',
	});
}

// Ride
function checkRideStatus(driverID) {
	return ajax({
		url: `${apiURL}/getRideStatus/${driverID}`,
		dataType: 'json',
	});
}

function getFareInfo() {
	return ajax({
		url: `${apiURL}/getFareInfo`,
		dataType: 'json',
	});
}

function reachedDestination(fareID) {
	return ajax({
		url: `${apiURL}/dropOff/${fareID}`,
		dataType: 'json',
	});
}





/**
 * DRIVER API
   ========================================*/

// Availability
function online() {
	return ajax({
		url: `${apiURL}/driverGoOnline`,
		dataType: 'json',
	});
}

function offline() {
	return ajax({
		url: `${apiURL}/driverGoOffline`,
		dataType: 'json',
	});
}



// Jobs
function checkJob() {
	return ajax({
		url: `${apiURL}/driverCheckJobs`,
		dataType: 'json',
	});
}

function acceptJob() {
	return ajax({
		url: `${apiURL}/acceptJobs`,
		dataType: 'json',
	});
}

function declineJob() {
	return ajax({
		url: `${apiURL}/rejectJobs`,
		dataType: 'json',
	});
}


// Betting
function driverGetBetResult(betID) {
	return ajax({
		url: `${apiURL}/driverGetBetResult/${betID}`,
		dataType: 'json',
	});
}


// Ride
function getRiderInfo(riderID) {
	return ajax({
		url: `${apiURL}/getRiderDetails/${riderID}`,
		dataType: 'json',
	});
}

function setRiderDestination(riderID, lng, lat, betID = 0) {
	betID = betID ? betID : `/${betID}`;
	return ajax({
		url: `${apiURL}/setDestination/${riderID}/${lng}/${lat}${betID}`,
		dataType: 'json',
	});
}

class User {
    constructor() {
        this.username = window.globalVar.username || '';
        this.name = window.globalVar.name || '';
        this.contactNum = window.globalVar.contactNum || '';
        this.profilePic = window.globalVar.profilePic || '';

        this.lat = null;
        this.lng = null;
        this.velocity = null;
        
        this.target = {
            lat: null,
            lng: null
        };
    }
    
    get coords() { 
        return {lat: this.lat, lng: this.lng};
    };

    get destination() { 
        return {lat: this.target.lat, lng: this.target.lng};
    };

    updatePosition() {
        let _this = this;
        
        return new Promise((resolve, reject)=>{
            function cb_success(pos) {

                // get latitude and longitude
                _this.lat = pos.coords.latitude;
                _this.lng = pos.coords.longitude;
                _this.velocity = pos.coords.speed;

                let recentCoords = {lat: _this.lat, lng: _this.lng};
                localStorage.setItem('recentCoords', JSON.stringify(recentCoords));

                setCoords(_this.lng, _this.lat);
                
                resolve(pos);
            }

            function cb_error(err) {

                // get latitude and longitude
                console.warn('ERROR(' + err.code + '): ' + err.message);

                if(err.code == 1) {
                    navigator.permissions.query({'name': 'geolocation'}).then((permission) => {
                        if(permission.state == 'prompt') {
                            window.globalVar.isGPSTurnedOn = false;
                            alert('Please turn on your (GPS) Location service.');
                        } else if (permission.state == 'denied') {
                            window.globalVar.accessOfLocation = false;
                            alert('Please allow us to access your (GPS) Location service to use our app.');
                        }
                    });
                }

                reject(err);
            }

            let options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(cb_success, cb_error, options);
        });
    }

    watchPosition() {
        let _this = this;

        return new Promise((resolve, reject)=>{
            function cb_success(pos) {

                // get latitude and longitude
                _this.lat = pos.coords.latitude;
                _this.lng = pos.coords.longitude;
                _this.velocity = pos.coords.speed;

                let recentCoords = {lat: _this.lat, lng: _this.lng};
                localStorage.setItem('recentCoords', JSON.stringify(recentCoords));

                if (_this.target.lat === _this.lat && _this.target.lng === _this.lng) {
                    console.log('Congratulations, you have reached your destination');
                    navigator.geolocation.clearWatch(_this.watcher);
                }

                setCoords(_this.lng, _this.lat);

                resolve(pos);
            }

            function cb_error(err) {
                // get latitude and longitude
                console.warn('ERROR(' + err.code + '): ' + err.message);

                if(err.code == 1) {
                    navigator.permissions.query({'name': 'geolocation'}).then((permission) => {
                        if(permission.state == 'prompt') {
                            window.globalVar.isGPSTurnedOn = false;
                            alert('Please turn on your (GPS) Location service.');
                        } else if (permission.state == 'denied') {
                            window.globalVar.accessOfLocation = false;
                            alert('Please allow us to access your (GPS) Location service to use our app.');
                        }
                    });
                }

                reject(err);
            }

            let options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            
            _this.watcher = navigator.geolocation.watchPosition(cb_success, cb_error, options);
        });
    }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

class Rider extends User {
	constructor() {
		super();

		this.isOnline = false;
		this.delayTime = 3000;
		this.intervalID = 0;
		this.timeoutID = {
			rideConfirmation: 0,
		};
		this.duration = {
			rideConfirmation: 10 * 1000,
			waitingArrivalOfDriver: 10 * 1000,
		};
		this.matchedDriverID = 0;
		this.matchedDriverInfo = {};
		this.fareInfo = {};
		this.betID = 0;
		// requestBtn
	}

	online() {
		console.log('Status : REQUESTING');
		popShortMsg('Searching for nearby UBER...');
		showOnlineIndicator();
		changeRequestBtn('Maybe next time', 'online', 'c-btn--ghost c-btn--tertiary', 'c-btn--primary');
		this.checkRequestStatus();
	}

	offline() {
		// Get a ride
		clearInterval(this.intervalID);
		console.log('Status : OFFLINE');
		popShortMsg('You\'re now offline');
		hideOnlineIndicator();
		changeRequestBtn('Go a ride', 'offline', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
		enableRequestBtn();
	}

	checkRequestStatus() {
		enableRequestBtn();
		this.clearLastDriverInfo();
		this.clearFareInfo();

		let _this = this;

		this.intervalID = setInterval(()=>{
			_this.nearbyDriver();
		}, this.delayTime);
	}

	nearbyDriver() {
		let _this = this;

		nearbyDriver().then((res)=>{
			console.log(res);
			let drivers = res || [];

			let messages = [
				'Result is on it\'s way',
				'Keep calm, ride safe!',
				'Finding you the best match',
				'Thank you for your patience'
			];
			let i = getRandomIntInclusive(0, messages.length - 1);
			popShortMsg(messages[i]);

			if(drivers.length > 0) {
				clearInterval(_this.intervalID);
				_this.matchDriver(drivers);
			}
		}).catch((err)=>{
			console.log(err);
			clearInterval(_this.intervalID);
			_this.offline();
		});
	}

	matchDriver(driverIDs) {
		disableRequestBtn();
		popShortMsg('Finalizing & preparing driver info');

		let driverID = driverIDs[0].id;

		if(driverIDs.length > 1){
			let i = getRandomIntInclusive(0, driverIDs.length - 1);
			driverID = driverIDs[i].id;
		}

		this.getDriverDetails(driverID);
	}

	getDriverDetails(id) {
		let _this = this;

		driverDetails(id).then((res)=>{
			_this.promptRide(res);
		}).catch((err)=>{
			console.log('Catched error: ', err);
		});
	}

	promptRide(driverDetails$$1) {
		let _this = this;
		// let profilePic = driverDetails.profilePic || '<i class="fa fa-2x fa-user"></i>';
		let profilePic = '<img src="http://i.pravatar.cc/96" style="border-radius: 50%;" />' || '<i class="fa fa-2x fa-user"></i>';
		let {id: driverID, name, rating, car_plate: carNumPlate, phone: contactNum} = driverDetails$$1;

		function capitalize(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		let carModel = `${capitalize(driverDetails$$1.car_color)} ${capitalize(driverDetails$$1.car_brand)} ${capitalize(driverDetails$$1.car_model)}`;

		let promptBox = customConfirm({
			title: 'You got a ride! Do you want it?',
			message: `
				<div style="text-align: center;">
					<p>${profilePic}</p>
					<p><b>${capitalize(name)}</b></p>
					<p>
						<div>${carNumPlate}</div>
						<small><i>${carModel}</i></small>
					</p>
					<p style="color: #1fbad6;">
						<i class="fa fa-lg fa-star"></i>
						<i class="fa fa-lg fa-star"></i>
						<i class="fa fa-lg fa-star"></i>
						<i class="fa fa-lg fa-star"></i>
						<i class="fa fa-lg fa-star-half-o"></i>
						${rating}
					</p>
					<p style="color: #888;"><i class="fa fa-phone"></i> ${contactNum}</p>
				</div>
			`,
			buttons: {
				cancel: {
					label: 'SKIP',
					className: 'btn-default'
				},
				confirm: {
					label: 'Let\'s go',
					className: 'btn-info'
				},
			},
			callback: (res)=>{
				clearTimeout(_this.timeoutID.rideConfirmation);

				if(res){
					_this.matchedDriverID = driverID;
					_this.matchedDriverInfo = driverDetails$$1;
					_this.acceptRide(driverID);
				} else {
					_this.declineRide(driverID);
				}
			}
		});

		this.timeoutID.rideConfirmation = setTimeout(()=>{
			
			promptBox.modal('hide');
			this.declineRide(driverID);

		}, this.duration.rideConfirmation);

	}

	acceptRide(driverID) {
		let _this = this;
		
		acceptRide(driverID).then(()=>{
			_this.waitForResponceOfDriver();
		});
	}

	declineRide(driverID) {
		this.checkRequestStatus();
	}


	waitForResponceOfDriver() {
		let _this = this;

		this.intervalID = setInterval(()=>{

			checkRideStatus(_this.matchedDriverID).then((res)=>{
				
				let messages = [
					'Waiting for driver\'s responce',
					'Still waiting...',
					'Keep calm, stay safe!',
					'Please hold on while driver reply',
					'Thank you for your patience'
				];
				let i = getRandomIntInclusive(0, messages.length - 1);
				popShortMsg(messages[i]);

				// 4 = pending, 5 = accepted, 6 = rejected, 20 = betting
				if(res.getRideStatus == 20) {
					clearInterval(_this.intervalID);
					_this.promptToBet(res.betID);
				}
				else if(res.getRideStatus == 5) {
					clearInterval(_this.intervalID);
					_this.waitForArrivalOfDriver();
				}
				else if(res.getRideStatus == 6) {
					clearInterval(_this.intervalID);
					_this.driverDeclinedJob();
				}
			});

		}, this.delayTime);
	}

	driverDeclinedJob() {
		let _this = this;

		customAlert({
			title: 'Ride aborted',
			message: '<p>Driver may have declined or failed to accept ride request in time.</p>',
			buttons: {
				ok: {
					label: 'Got it',
					className: 'btn-info'
				}
			},
			callback: _this.offline
		});
	}

	promptToBet(betID) {
		let _this = this;

		customDialog({
			title: 'Betting Required',
			message: `
				<h4>Bet to get this ride!</h4>
				<p>Same driver is requested by other user(s)</p>
				<div>
					<input type="number" id="betAmount" class="bootbox-input bootbox-input-number form-control" min="1" max="10" step="0.1" placeholder="(min.) $1.00 -- $10.00 (max.)" />
				</div>
			` ,
			buttons: {
				cancel: {
					label: 'Give up',
					className: "btn-default",
					callback: ()=>{
						_this.giveUpBet(betID);
					}
				},
				confirm: {
					label: 'Place bet',
					className: "btn-info",
					callback: ()=>{
						let betAmount = $('#betAmount').val();
						_this.placeBet(betID, betAmount);
					}
				}
			}
		});
	}

	placeBet(betID, amount) {
		let _this = this;

		placeBet(betID, amount).then((res)=>{
			if(res.winner < 0) {
				_this.checkBetResult(betID);
			} else {
				if(res.isWin) {
					_this.winBet();
				} else {
					_this.loseBet();
				}
			}
		});
	}

	giveUpBet(betID) {
		popShortMsg('Searching for other Uber driver');
		this.checkRequestStatus();
	}

	checkBetResult(betID) {
		let _this = this;

		this.betID = betID;

		this.intervalID = setInterval(()=>{

			checkBetResult(betID).then((res)=>{
				
				let messages = [
					'Waiting for other user...',
					'Still waiting...',
					'Keep calm, stay safe!',
					'Please hold on while others are betting',
					'Thank you for your patience',
				];
				let i = getRandomIntInclusive(0, messages.length - 1);
				popShortMsg(messages[i]);

				if(res.winner > 0) {
					clearInterval(_this.intervalID);
					if(res.isWin) {
						_this.winBet();
					} else {
						_this.loseBet();
					}
				}
			});

		}, this.delayTime);
	}

	winBet() {
		let _this = this;

		customDialog({
			title: 'Hooray!',
			message: `<h4>You have won the bet.</h4>
			<p>Please wait while your Uber is on it's way. Have a great day!</p>`,
			buttons: {
				ok: {
					label: 'Great!',
					className: 'btn-info',
					callback: ()=>{
						_this.waitForArrivalOfDriver();
					}
				}
			},
		});
	}

	loseBet() {
		let _this = this;

		customDialog({
			title: 'Sorry...',
			message: `<h4>You have lost the bet.</h4>
			<p>Don't worry you will get a <b>5% discount</b> on the next ride. Cheer up!</p>`,
			buttons: {
				ok: {
					label: 'Great!',
					className: 'btn-info',
					callback: ()=>{
						_this.offline();
					}
				}
			},
		});
	}

	waitForArrivalOfDriver() {

		changeRequestBtn('Picked up', 'waitingDriver', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
		enableRequestBtn();

		this.intervalID = setInterval(()=>{
			let messages = [
				'You may see your Uber is on it\'s way',
				'Still waiting...',
				'Keep calm, stay safe!',
				'Again, thanks for your patience',
				'Driver on the way',
			];

			let i = getRandomIntInclusive(0, messages.length - 1);
			
			popShortMsg(messages[i]);

		}, this.duration.waitingArrivalOfDriver);
	}

	pickedUpByDriver() {
		changeRequestBtn('Safely arrived', 'onTheRoad', 'c-btn--ghost c-btn--tertiary', 'c-btn--primary');
	}

	reachedDestination() {
		let _this = this;
		getFareInfo().then((fareInfo)=>{

			let fareID = fareInfo.id;
			let price = parseFloat(fareInfo.price);
			let betAmount = parseFloat(fareInfo.bet_amount);

			customDialog({
				title: 'Hope you enjoy the ride!',
				message: `<h4>The total fare of this trip is $${price + betAmount} ${(
					(betAmount > 0) ? `(${price} + ${betAmount})`: ''
				)}</h4>
				<p>Please pay by cash</p>`,
				buttons: {
					ok: {
						label: 'Okay',
						className: 'btn-info',
						callback: ()=>{
							reachedDestination(fareID);
							_this.offline();
						}
					}
				},
			});
		});
	}

	clearLastDriverInfo() {
		this.matchedDriverID = 0;
		this.matchedDriverInfo = {};
	}
	
	clearFareInfo() {
		this.fareInfo = {};
	}
}

class Driver extends User {
	constructor() {
		super();

		this.isOnline = false;
		this.intervalID = 0;
		this.delayTime = 2000;
		this.timeoutID = {
			jobConfirmation: 0,
			// betResultRetrieval: 0, // don't need, cause must wait for it to timeout
		};
		this.duration = {
			jobConfirmation: 15 * 1000,
			betResultRetrieval: 2 * 1000,
		};
		this.matchedRiderInfo = {};
		this.fareInfo = {};
		this.betID = 0;
		// onlineBtn
		window._UI = UI;
	}

	// Availability
	online() {
		let _this = this;

		online().then(()=>{
			console.log('Status : ONLINE');
			popShortMsg('Waiting for request...');
			showOnlineIndicator();
			changeOnlineBtn('Go offline', 'online', 'c-btn--ghost c-btn--tertiary', 'c-btn--primary');
			_this.checkJob();
		}).catch((err)=>{
			hideOnlineIndicator();
			changeOnlineBtn('Go online', 'offline', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
			enableOnlineBtn();
		});
	}

	offline() {
		clearInterval(this.intervalID);
		offline().then(()=>{
			console.log('Status : OFFLINE');
			popShortMsg('You\'re now offline');
			hideOnlineIndicator();
			changeOnlineBtn('Go online', 'offline', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
			enableOnlineBtn();
		});
	}


	// Jobs
	checkJob() {
		let _this = this;

		this.intervalID = setInterval(()=>{
			checkJob().then((res)=>{

				let messages = [
					'Please wait while searching for ride',
					'Keep calm, drive safe!',
					'Are your car in optimum condition?',
					'Remember to check your fuel',
					'Thank you for your patience'
				];
				let i = getRandomIntInclusive(0, messages.length - 1);
				popShortMsg(messages[i]);

				if(res.jobs) {
					clearInterval(_this.intervalID);
					_this.promptJob();
				}

			}).catch((err)=>{
				console.log(err);
				clearInterval(_this.intervalID);
				_this.offline();
			});
		}, this.delayTime);
	}

	promptJob() {
		let _this = this;
		
		disableOnlineBtn();

		let dialogBox = customDialog({
			message: 'New Job Request!',
			buttons: {
				cancel: {
					label: 'No, thanks',
					className: 'btn-default',
					callback: ()=>{
						clearTimeout(_this.timeoutID.jobConfirmation);
						_this.declineJob();
					}
				},
				confirm: {
					label: 'Let\'s go!',
					className: 'btn-info',
					callback: ()=>{
						clearTimeout(_this.timeoutID.jobConfirmation);
						_this.acceptJob();
					}
				}
			},
		});
		
		this.timeoutID.jobConfirmation = setTimeout(()=>{
			// Decline job if no reply
			dialogBox.modal('hide');
			_this.declineJob();
		}, this.duration.jobConfirmation);
	}

	acceptJob() {
		let _this = this;
		acceptJob().then((res)=>{
			if(res.is_betting) {
				
				customAlert('You are on demand! Please wait while rider is betting.');

				setTimeout(()=>{

					_this.checkBetResult(res.bet_id);

				}, _this.duration.betResultRetrieval);

				_this.betID = res.bet_id;
			} 
			else {
				_this.getRiderInfo(res.rider_id);
			}
		});
	}

	declineJob() {
		let _this = this;

		declineJob().then(()=>{
			_this.offline();
		});
	}


	// Betting
	checkBetResult(betID) {
		let _this = this;

		this.intervalID = setInterval(()=>{
			driverGetBetResult(betID).then((res)=>{
				
				let messages = [
					'Result is on it\'s way',
					'Keep calm, drive safe!',
					'Are you ready for pick up?',
					'Thank you for your patience'
				];
				let i = getRandomIntInclusive(0, messages.length - 1);
				popShortMsg(messages[i]);

				if(res.winner > 0) {
					clearInterval(_this.intervalID);
					_this.getRiderInfo(res.winner);
					popShortMsg('Finalizing & preparing rider info');
				}

			}).catch((err)=>{
				clearInterval(_this.intervalID);
				this.offline();
			});
		}, this.delayTime);
	}



	// Ride
	getRiderInfo(riderID) {
		let _this = this;
		
		getRiderInfo(riderID).then((res)=>{
			let rider = res.rider;
			let coords = {
				lat: parseFloat(rider.latitude),
				lng: parseFloat(rider.longitute),
			};

			gMap.getAddressFromLatLng(coords).then((addr)=>{
				rider.locationAddress = addr;
				_this.promptRiderInfo(rider);

				changeOnlineBtn('Picked up', 'pickingUp', '','c-btn--ghost');
				enableOnlineBtn();

				_this.matchedRiderInfo = rider;
				_this.target = coords;
			}).catch((err)=>{
				console.log(err);
			});
		});
	}

	promptRiderInfo(info) {
		let _this = this;
		// let profilePic = info.profilePic || '<i class="fa fa-2x fa-user"></i>';
		let profilePic = '<img src="http://i.pravatar.cc/96" style="border-radius: 50%;" />' || '<i class="fa fa-2x fa-user"></i>';
		let {name, locationAddress, phone: contactNum} = info;

		function capitalize(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		customDialog({
			title: 'Rider\'s Info',
			message: `
				<div style="text-align: center;">
					<p>${profilePic}</p>
					<p><b>${capitalize(name)}</b></p>
					<p><i>${locationAddress}</i></p>
					<p style="color: #888;"><i class="fa fa-phone"></i> ${contactNum}</p>
				</div>
			`,
			buttons: {
				ok: {
					label: 'Okay',
					className: 'btn-info',
					callback: ()=>{
						console.log('blablabla');
						enableOnlineBtn();
						_this.minimizeUserInfo();
					}
				}
			},
			
		});
	}

	minimizeUserInfo() {
		let _this = this;

		gMap.getDirection(_this.target);
	}

	pickedUpRider() {
		let _this = this;
		customPrompt('Please enter rider\'s destination', (res)=>{
			if(res) {
				_this.setDestination(res);
			}
		});
	}

	setDestination(destination) {
		let _this = this;

		gMap.getLatLngFromAddress(destination).then((location)=>{
			_this.target = location;
			console.log('location: ',location);

			gMap.getDirection(_this.target);

			changeOnlineBtn('Dropped off', 'fetchingRider', 'c-btn--ghost', '');
			enableOnlineBtn();
			
		}).then(()=>{
			let riderID = _this.matchedRiderInfo.id;
			let {lat, lng} = _this.target;
			let betID = _this.betID;

			setRiderDestination(riderID, lng, lat, betID).then((res)=>{
				let _this = this;
				_this.fareInfo = {
					distance: res.distance,
					rate: res.fare_rate,
					price: parseFloat(res.price),
					betAmount: parseFloat(res.bet_amount),
				};
			});
		}).catch((err)=>{
			console.log(err);
		});
	}

	droppedOffRider() {
		gMap.reInitMap();
		this.offline();
	}

}

class GMap {
    constructor(id, coords = JSON.parse(localStorage.recentCoords) || {lat: 0, lng: 0}) {
        this.GOOGLE_API_URL = 'https://maps.googleapis.com/maps/api/js';
        this.GOOGLE_API_KEY = 'AIzaSyDA5My2O0NTE4z1v3u4CcUnbRR7pU-Wgg4';

        this.map = null;
        this.marker = null;
        this.mapContainer = document.getElementById(id);
        this.mapOptions = {
            center: coords, // *required
            zoom: 17, // *required
            disableDefaultUI: true,
            gestureHandling: 'greedy',
            // styles: theme.night, // theme.night,
            backgroundColor: '#000',
        };
        this.geocoder = null;

        // Initialize to GET scripts for google.maps object
        this.initGoogleMapAPI();
    }

    initCB() {
        console.log('(not using) bcz InitCB called too fast, before AJAX response is returned');
    }

    initGoogleMapAPI() {
        let _this = this;
        $.ajax({
            url: this.GOOGLE_API_URL,
            data: {
                key: this.GOOGLE_API_KEY,
                sensor: true,
                callback: this.initCB
            },
            dataType: 'script',
            success: function() {
                console.log('Google Map API Initialized');
                _this.initMap();
                _this.initGeocoder();
            }
        });
    }

    initMap() {
        let _this = this;

        _this.map = new google.maps.Map(_this.mapContainer, _this.mapOptions);
        console.log('Map Initialized');

        _this.marker = new google.maps.Marker({
            position: _this.mapOptions.center,
            map: _this.map
        });
    }

    reInitMap() {
        this.initMap();
    }

    initGeocoder() {
        this.geocoder = new google.maps.Geocoder;
    }

    initDistanceService() {
        this.distanceService = new google.maps.DistanceMatrixService;
    }


    getDirection(destination) {
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            map: this.map
        });
        this.calculateAndDisplayRoute(destination, this.directionsService, this.directionsDisplay);
    }

    calculateAndDisplayRoute(destination, directionsService, directionsDisplay) {
        directionsService.route({
            origin: this.marker.getPosition(),
            destination: destination || 'Masjid Negeri, Penang',
            travelMode: 'DRIVING',
        }, function(response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    setMapOptions(options) {
        this.map.setOptions(options);
    }

    getAddressFromLatLng(location) {
        // 
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({'location': location}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        resolve(results[0].formatted_address);
                    } else {
                        reject('No results found');
                    }
                } else {
                    reject('Geocoder failed due to: ' + status);
                }
            });
        });
    }

    getLatLngFromAddress(address) {
        // 
        return new Promise((resolve, reject) => {
            this.geocoder.geocode({'address': address}, function(results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        let location = {
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                        };
                        resolve(location);
                    } else {
                        reject('No results found');
                    }
                } else {
                    reject('Geocoder failed due to: ' + status);
                }
            });
        });
    }

    getDistance(from, to) {
        return new Promise((resolve, reject) => {
            this.distanceService.getDistanceMatrix({
                origins: [from],
                destinations: [to],
                travelMode: 'DRIVING',
                // unitSystem: google.maps.UnitSystem.METRIC,
                // avoidHighways: false,
                // avoidTolls: false
            }, function(results, status) {
                if (status === 'OK') {
                    if (result) {
                        resolve(result.rows.elements.distance);
                    } else {
                        reject('No results found');
                    }
                } else {
                    reject('Geocoder failed due to: ' + status);
                }
            });
        });
    }

} // END class

let userRole = globalVar.userRole || 'rider';
// used in User::watchPosition() & ::updatePosition()
window.globalVar.accessOfLocation = 'unknown';
window.globalVar.isGPSTurnedOn = 'unknown';


// #APP-MENU (#APP #MENU)
$('.js-appMenuToggle').on('click', function(e){
	$('#appMenu').toggleClass('open');
});


if(userRole == 'driver') {

	var driver = new Driver();

	// Initialize map after getting user's position
	driver.watchPosition().then((positionObj)=>{
		window.gMap = new GMap('mapContainer', driver.coords);
	}).catch((errMsg)=>{
		window.gMap = new GMap('mapContainer');
		// Remind user to open GPS location (temp dun nid do here)
	});

	window.driverA = driver;

	// #ONLINE (GO ONLINE)
	$('#onlineBtn').on('click', function(e){

		let status = $(this).data('status');

		switch(status) {
			case 'offline':
				driver.online();
				break;

			case 'online':
				driver.offline();
				break;

			case 'pickingUp':
				driver.pickedUpRider();
				break;

			case 'fetchingRider':
				driver.droppedOffRider();
				break;

			default:
				console.log(status);
				return status;
		}
		
	});

	window.addEventListener('unload', function(event) {
		let data = '';
		navigator.sendBeacon(`${(window.globalVar.baseURI || document.baseURI)}api/driverGoOffline`, data);
	});

} else {

	var rider = new Rider();
	
	// Initialize map after getting user's position
	rider.watchPosition().then((positionObj)=>{
		// console.log(positionObj);
		window.gMap = new GMap('mapContainer', rider.coords);
	}).catch((errMsg)=>{
		console.log(errMsg);
		window.gMap = new GMap('mapContainer');
		// Remind user to open GPS location (temp dun nid do here)
	});



	// #ONLINE (GET A RIDE)
	$('#requestBtn').on('click', function(e){

		let status = $(this).data('status');

		switch(status) {
			case 'offline':
				rider.online();
				break;

			case 'online':
				rider.offline();
				break;

			case 'waitingDriver':
				rider.pickedUpByDriver();
				break;

			case 'onTheRoad':
				rider.reachedDestination();
				break;

			default:
				console.log(status);
				return status;
		}
		
	});

}

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyJtb2R1bGVzL3VpLmpzIiwibW9kdWxlcy9FcnJvckhhbmRsZXIuanMiLCJtb2R1bGVzL2FwaS5qcyIsIm1vZHVsZXMvVXNlci5qcyIsIm1vZHVsZXMvVXRpbGl0eS5qcyIsIm1vZHVsZXMvUmlkZXIuanMiLCJtb2R1bGVzL0RyaXZlci5qcyIsIm1vZHVsZXMvR01hcC5qcyIsIm1haW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG93T25saW5lSW5kaWNhdG9yKCkge1xyXG5cdCQoJyNvbmxpbmVJbmRpY2F0b3InKS5hZGRDbGFzcygnb25saW5lJyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoaWRlT25saW5lSW5kaWNhdG9yKCkge1xyXG5cdCQoJyNvbmxpbmVJbmRpY2F0b3InKS5yZW1vdmVDbGFzcygnb25saW5lJyk7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBvcFNob3J0TXNnKG1zZyA9ICcnLCBhdXRvQ2xvc2UgPSAzMDAwKSB7XHJcblx0bGV0IHRvYXN0ID0gJCgnI3Nob3J0TXNnJyk7XHJcblx0bGV0IHRpbWVvdXRJRCA9IHRvYXN0LmRhdGEoJ3RpbWVvdXQnKTtcclxuXHJcblx0Ly8gUHJldmVudCBjbG9zaW5nIGR1ZSB0byBwcmV2aW91cyB0aW1lb3V0XHJcblx0aWYgKHRpbWVvdXRJRCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRJRCk7XHJcblx0XHR0b2FzdC5kYXRhKCd0aW1lb3V0JywgJycpO1xyXG5cdH1cclxuXHJcblx0Ly8gTmVlZCB0byBjbG9zZSBpdCB0aGVuIG9ubHkgcmUtc2hvdyBpdCB3aXRoIG5ldyBtZXNzYWdlXHJcblx0aWYoIXRvYXN0Lmhhc0NsYXNzKCdoaWRlJykpIHtcclxuXHRcdHRvYXN0LmFkZENsYXNzKCdoaWRlJyk7XHJcblxyXG5cdFx0c2V0VGltZW91dCgoKT0+e1xyXG5cdFx0XHR0b2FzdC5odG1sKG1zZylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHR9LCAzMDApO1xyXG5cclxuXHR9IFxyXG5cdGVsc2Uge1xyXG5cdFx0dG9hc3QuaHRtbChtc2cpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdH1cclxuXHJcblx0aWYoYXV0b0Nsb3NlKSB7XHJcblx0XHRsZXQgaWQgPSBzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdHRvYXN0LmFkZENsYXNzKCdoaWRlJylcclxuXHRcdFx0XHQuZGF0YSgndGltZW91dCcsICcnKTtcclxuXHRcdH0sIGF1dG9DbG9zZSk7XHJcblxyXG5cdFx0dG9hc3QuZGF0YSgndGltZW91dCcsIGlkKTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoaWRlU2hvcnRNc2coKSB7XHJcblx0bGV0IHRvYXN0ID0gJCgnI3Nob3J0TXNnJyk7XHJcblx0bGV0IHRpbWVvdXRJRCA9IHRvYXN0LmRhdGEoJ3RpbWVvdXQnKTtcclxuXHJcblx0aWYgKHRpbWVvdXRJRCkge1xyXG5cdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXRJRCk7XHJcblx0XHR0b2FzdC5kYXRhKCd0aW1lb3V0JywgJycpO1xyXG5cdH1cclxuXHJcblx0dG9hc3QuYWRkQ2xhc3MoJ2hpZGUnKTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tQWxlcnQobXNnLCBjYikge1xyXG5cdGlmIChjYikge1xyXG5cdFx0cmV0dXJuIGJvb3Rib3guYWxlcnQobXNnLCBjYik7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBib290Ym94LmFsZXJ0KG1zZyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tQ29uZmlybShtc2csIGNiKSB7XHJcblx0aWYgKGNiKSB7XHJcblx0XHRyZXR1cm4gYm9vdGJveC5jb25maXJtKG1zZywgY2IpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gYm9vdGJveC5jb25maXJtKG1zZyk7XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3VzdG9tUHJvbXB0KG1zZywgY2IpIHtcclxuXHRpZiAoY2IpIHtcclxuXHRcdHJldHVybiBib290Ym94LnByb21wdChtc2csIGNiKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIGJvb3Rib3guY29uZmlybShtc2cpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbURpYWxvZyhvcHRpb25zKSB7XHJcblx0cmV0dXJuIGJvb3Rib3guZGlhbG9nKG9wdGlvbnMpO1xyXG59XHJcblxyXG5cclxuLypcclxuZXhwb3J0IGZ1bmN0aW9uIHNob3dBcHBJbnB1dEJhcigpIHtcclxuXHQkKCcjYXBwSW5wdXRCYXInKS5mYWRlSW4oKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVBcHBJbnB1dEJhcigpIHtcclxuXHQkKCcjYXBwSW5wdXRCYXInKS5mYWRlT3V0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBJbnB1dFZhbCgpIHtcclxuXHQkKCcjYXBwSW5wdXQnKS52YWwoKTtcclxufVxyXG4qL1xyXG5cclxuXHJcblxyXG5cclxuLy8gRk9SIERSSVZFUlxyXG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlT25saW5lQnRuKCkge1xyXG5cdCQoJyNvbmxpbmVCdG4nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVPbmxpbmVCdG4oKSB7XHJcblx0JCgnI29ubGluZUJ0bicpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGFuZ2VPbmxpbmVCdG4odHh0LCBzdGF0dXMgPSAnJywgY2xhc3NUb0FkZCA9ICcnLCBjbGFzc1RvUmVtb3ZlID0gJycpIHtcclxuXHQkKCcjb25saW5lQnRuJykuYWRkQ2xhc3MoY2xhc3NUb0FkZClcclxuXHRcdC5yZW1vdmVDbGFzcyhjbGFzc1RvUmVtb3ZlKVxyXG5cdFx0Lmh0bWwodHh0KVxyXG5cdFx0LmRhdGEoJ3N0YXR1cycsIHN0YXR1cyk7XHRcclxufVxyXG5cclxuXHJcblxyXG4vLyBGT1IgUklERVJcclxuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZVJlcXVlc3RCdG4oKSB7XHJcblx0JCgnI3JlcXVlc3RCdG4nKS5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGVSZXF1ZXN0QnRuKCkge1xyXG5cdCQoJyNyZXF1ZXN0QnRuJykucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoYW5nZVJlcXVlc3RCdG4odHh0LCBzdGF0dXMgPSAnJywgY2xhc3NUb0FkZCA9ICcnLCBjbGFzc1RvUmVtb3ZlID0gJycpIHtcclxuXHQkKCcjcmVxdWVzdEJ0bicpLmFkZENsYXNzKGNsYXNzVG9BZGQpXHJcblx0XHQucmVtb3ZlQ2xhc3MoY2xhc3NUb1JlbW92ZSlcclxuXHRcdC5odG1sKHR4dClcclxuXHRcdC5kYXRhKCdzdGF0dXMnLCBzdGF0dXMpO1x0XHJcbn1cclxuIiwiaW1wb3J0IGVycm9yTXNnIGZyb20gJy4vZXJyb3JNc2cuanNvbic7XHJcbmltcG9ydCAqIGFzIFVJIGZyb20gJy4vdWknO1xyXG5cclxuY29uc3QgRXJyb3JIYW5kbGVyID0gKCgpPT57XHJcblx0ZnVuY3Rpb24gZGVjb2RlKGVyckNvZGUpe1xyXG5cdFx0bGV0IGNvZGUgPSBlcnJDb2RlLnRvU3RyaW5nKCk7XHJcblx0XHRyZXR1cm4gZXJyb3JNc2dbY29kZV07XHJcblx0fVxyXG5cclxuXHQvLyBhbGVydCwgcHJvbXB0LCBjb25maXJtYXRpb24sIGN1c3RvbVxyXG5cdC8vIChpbmZvLCB3YXJuaW5nLCBlcnJvciwgc3VjY2VzcylcclxuXHRmdW5jdGlvbiBhbGVydChlcnJDb2RlLCBjYWxsYmFjaywgdHlwZSA9ICdlcnJvcicpIHtcclxuXHRcdGxldCBtc2cgPSBkZWNvZGUoZXJyQ29kZSkgfHwgZXJyQ29kZSB8fCAnJztcclxuXHRcdFVJLmN1c3RvbUFsZXJ0KG1zZyk7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0ZGVjb2RlLFxyXG5cdFx0YWxlcnRcclxuXHR9O1xyXG5cclxufSkoKTtcclxuXHJcbmV4cG9ydCB7RXJyb3JIYW5kbGVyIGFzIGRlZmF1bHR9OyIsIlxyXG5pbXBvcnQgRXJyb3JIYW5kbGVyIGZyb20gJy4vRXJyb3JIYW5kbGVyJztcclxuXHJcbmxldCBhcGlVUkwgPSBgJHsod2luZG93Lmdsb2JhbFZhci5iYXNlVVJJIHx8IGRvY3VtZW50LmJhc2VVUkkpfWFwaWA7XHJcblxyXG5mdW5jdGlvbiBhamF4KG9wdGlvbnMpIHtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0JC5hamF4KG9wdGlvbnMpLmRvbmUoZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRcdGlmKHJlcy5lcnJDb2RlID09IDEpIHtcclxuXHRcdFx0XHRyZXNvbHZlKHJlcy5kYXRhKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRFcnJvckhhbmRsZXIuYWxlcnQocmVzLmVyckNvZGUpO1xyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoRXJyb3JIYW5kbGVyLmRlY29kZShyZXMuZXJyQ29kZSkpO1xyXG5cdFx0XHRcdHJlamVjdChyZXMuZXJyQ29kZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pLmZhaWwoZnVuY3Rpb24oeGhyLCBtc2csIGVycikgeyBcclxuXHRcdFx0Y29uc29sZS5lcnJvcignRXJyb3I6ICcsIGVycik7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogU0hBUkVEIEFQSVxyXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbi8qKlxyXG4gKiBMT0dJTlxyXG4gKiBcclxuICogQHBhcmFtIHJlcURhdGEgW0Zvcm1EYXRhIHwgT2JqZWN0XSB7IHVzZXJuYW1lLCBwYXNzd29yZCB9XHJcbiAqIFxyXG4gKiBFeHBlY3RlZCByZXNwb25zZSB3aGVuIHN1Y2Vzc2Z1bGx5IGxvZ2dlZCBpbjogXHJcbiAqIC0gZXJyQ29kZTogMVxyXG4gKiAtIHJvbGU6ICgxID0gJ2RyaXZlcicgfCAyID0gJ3JpZGVyJykgKGluIFsnZGF0YSddKVxyXG4gKiBcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2dpbihyZXFEYXRhKSB7XHJcblx0cmV0dXJuIGFqYXgoe1xyXG5cdFx0dXJsOiBgJHthcGlVUkx9L2xvZ2luYCxcclxuXHRcdG1ldGhvZDogJ1BPU1QnLFxyXG5cdFx0ZGF0YTogcmVxRGF0YSxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29yZHModXNlcklEKSB7XHJcblx0cmV0dXJuIGFqYXgoe1xyXG5cdFx0dXJsOiBgJHthcGlVUkx9L2dldFVzZXJMYXN0TG9jYXRpb24vJHt1c2VySUR9YCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRDb29yZHMobG5nLCBsYXQpIHtcclxuXHRyZXR1cm4gYWpheCh7XHJcblx0XHR1cmw6IGAke2FwaVVSTH0vc2V0VXNlckxhc3RMb2NhdGlvbi8ke2xuZ30vJHtsYXR9YCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG5cclxuLyoqXHJcbiAqIFJJREVSIEFQSVxyXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbi8vIHJldHVybiBbe25hbWUsIGxvbmdpdHVkZSwgbGF0aXR1ZGUsIGRpc3RhbmNlfSx7bmFtZSwuLi59XVxyXG5leHBvcnQgZnVuY3Rpb24gbmVhcmJ5RHJpdmVyKCkge1xyXG5cdHJldHVybiBhamF4KHtcclxuXHRcdHVybDogYCR7YXBpVVJMfS9nZXROZWFyYnlEcml2ZXJgLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyaXZlckRldGFpbHMoZHJpdmVySUQpIHtcclxuXHRyZXR1cm4gYWpheCh7XHJcblx0XHR1cmw6IGAke2FwaVVSTH0vZ2V0RHJpdmVyRGV0YWlscy8ke2RyaXZlcklEfWAsXHJcblx0XHRkYXRhVHlwZTogJ2pzb24nLFxyXG5cdH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWNjZXB0UmlkZShkcml2ZXJJRCkge1xyXG5cdHJldHVybiBhamF4KHtcclxuXHRcdHVybDogYCR7YXBpVVJMfS9hY2NlcHRSaWRlLyR7ZHJpdmVySUR9YCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcblxyXG4vLyBCZXR0aW5nXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0JldFJlc3VsdChiZXRJRCkge1xyXG5cdHJldHVybiBhamF4KHtcclxuXHRcdHVybDogYCR7YXBpVVJMfS9nZXRCZXRSZXN1bHQvJHtiZXRJRH1gLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBsYWNlQmV0KGJldElELCBhbW91bnQpIHtcclxuXHRyZXR1cm4gYWpheCh7XHJcblx0XHR1cmw6IGAke2FwaVVSTH0vcGxhY2VCZXQvJHtiZXRJRH0vJHthbW91bnR9YCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIFJpZGVcclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUmlkZVN0YXR1cyhkcml2ZXJJRCkge1xyXG5cdHJldHVybiBhamF4KHtcclxuXHRcdHVybDogYCR7YXBpVVJMfS9nZXRSaWRlU3RhdHVzLyR7ZHJpdmVySUR9YCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRGYXJlSW5mbygpIHtcclxuXHRyZXR1cm4gYWpheCh7XHJcblx0XHR1cmw6IGAke2FwaVVSTH0vZ2V0RmFyZUluZm9gLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlYWNoZWREZXN0aW5hdGlvbihmYXJlSUQpIHtcclxuXHRyZXR1cm4gYWpheCh7XHJcblx0XHR1cmw6IGAke2FwaVVSTH0vZHJvcE9mZi8ke2ZhcmVJRH1gLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBEUklWRVIgQVBJXHJcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xyXG5cclxuLy8gQXZhaWxhYmlsaXR5XHJcbmV4cG9ydCBmdW5jdGlvbiBvbmxpbmUoKSB7XHJcblx0cmV0dXJuIGFqYXgoe1xyXG5cdFx0dXJsOiBgJHthcGlVUkx9L2RyaXZlckdvT25saW5lYCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvZmZsaW5lKCkge1xyXG5cdHJldHVybiBhamF4KHtcclxuXHRcdHVybDogYCR7YXBpVVJMfS9kcml2ZXJHb09mZmxpbmVgLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBKb2JzXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja0pvYigpIHtcclxuXHRyZXR1cm4gYWpheCh7XHJcblx0XHR1cmw6IGAke2FwaVVSTH0vZHJpdmVyQ2hlY2tKb2JzYCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhY2NlcHRKb2IoKSB7XHJcblx0cmV0dXJuIGFqYXgoe1xyXG5cdFx0dXJsOiBgJHthcGlVUkx9L2FjY2VwdEpvYnNgLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlY2xpbmVKb2IoKSB7XHJcblx0cmV0dXJuIGFqYXgoe1xyXG5cdFx0dXJsOiBgJHthcGlVUkx9L3JlamVjdEpvYnNgLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8vIEJldHRpbmdcclxuZXhwb3J0IGZ1bmN0aW9uIGRyaXZlckdldEJldFJlc3VsdChiZXRJRCkge1xyXG5cdHJldHVybiBhamF4KHtcclxuXHRcdHVybDogYCR7YXBpVVJMfS9kcml2ZXJHZXRCZXRSZXN1bHQvJHtiZXRJRH1gLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8vIFJpZGVcclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJpZGVySW5mbyhyaWRlcklEKSB7XHJcblx0cmV0dXJuIGFqYXgoe1xyXG5cdFx0dXJsOiBgJHthcGlVUkx9L2dldFJpZGVyRGV0YWlscy8ke3JpZGVySUR9YCxcclxuXHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0fSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRSaWRlckRlc3RpbmF0aW9uKHJpZGVySUQsIGxuZywgbGF0LCBiZXRJRCA9IDApIHtcclxuXHRiZXRJRCA9IGJldElEID8gYmV0SUQgOiBgLyR7YmV0SUR9YDtcclxuXHRyZXR1cm4gYWpheCh7XHJcblx0XHR1cmw6IGAke2FwaVVSTH0vc2V0RGVzdGluYXRpb24vJHtyaWRlcklEfS8ke2xuZ30vJHtsYXR9JHtiZXRJRH1gLFxyXG5cdFx0ZGF0YVR5cGU6ICdqc29uJyxcclxuXHR9KTtcclxufSIsImltcG9ydCAqIGFzIEFQSSBmcm9tICcuL2FwaS5qcyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVc2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB3aW5kb3cuZ2xvYmFsVmFyLnVzZXJuYW1lIHx8ICcnO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHdpbmRvdy5nbG9iYWxWYXIubmFtZSB8fCAnJztcclxuICAgICAgICB0aGlzLmNvbnRhY3ROdW0gPSB3aW5kb3cuZ2xvYmFsVmFyLmNvbnRhY3ROdW0gfHwgJyc7XHJcbiAgICAgICAgdGhpcy5wcm9maWxlUGljID0gd2luZG93Lmdsb2JhbFZhci5wcm9maWxlUGljIHx8ICcnO1xyXG5cclxuICAgICAgICB0aGlzLmxhdCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sbmcgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBudWxsO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0ge1xyXG4gICAgICAgICAgICBsYXQ6IG51bGwsXHJcbiAgICAgICAgICAgIGxuZzogbnVsbFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGdldCBjb29yZHMoKSB7IFxyXG4gICAgICAgIHJldHVybiB7bGF0OiB0aGlzLmxhdCwgbG5nOiB0aGlzLmxuZ307XHJcbiAgICB9O1xyXG5cclxuICAgIGdldCBkZXN0aW5hdGlvbigpIHsgXHJcbiAgICAgICAgcmV0dXJuIHtsYXQ6IHRoaXMudGFyZ2V0LmxhdCwgbG5nOiB0aGlzLnRhcmdldC5sbmd9O1xyXG4gICAgfTtcclxuXHJcbiAgICB1cGRhdGVQb3NpdGlvbigpIHtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYl9zdWNjZXNzKHBvcykge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGdldCBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlXHJcbiAgICAgICAgICAgICAgICBfdGhpcy5sYXQgPSBwb3MuY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMubG5nID0gcG9zLmNvb3Jkcy5sb25naXR1ZGU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy52ZWxvY2l0eSA9IHBvcy5jb29yZHMuc3BlZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJlY2VudENvb3JkcyA9IHtsYXQ6IF90aGlzLmxhdCwgbG5nOiBfdGhpcy5sbmd9O1xyXG4gICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3JlY2VudENvb3JkcycsIEpTT04uc3RyaW5naWZ5KHJlY2VudENvb3JkcykpO1xyXG5cclxuICAgICAgICAgICAgICAgIEFQSS5zZXRDb29yZHMoX3RoaXMubG5nLCBfdGhpcy5sYXQpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiX2Vycm9yKGVycikge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGdldCBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0VSUk9SKCcgKyBlcnIuY29kZSArICcpOiAnICsgZXJyLm1lc3NhZ2UpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGVyci5jb2RlID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IucGVybWlzc2lvbnMucXVlcnkoeyduYW1lJzogJ2dlb2xvY2F0aW9uJ30pLnRoZW4oKHBlcm1pc3Npb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocGVybWlzc2lvbi5zdGF0ZSA9PSAncHJvbXB0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lmdsb2JhbFZhci5pc0dQU1R1cm5lZE9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIHR1cm4gb24geW91ciAoR1BTKSBMb2NhdGlvbiBzZXJ2aWNlLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHBlcm1pc3Npb24uc3RhdGUgPT0gJ2RlbmllZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5nbG9iYWxWYXIuYWNjZXNzT2ZMb2NhdGlvbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ1BsZWFzZSBhbGxvdyB1cyB0byBhY2Nlc3MgeW91ciAoR1BTKSBMb2NhdGlvbiBzZXJ2aWNlIHRvIHVzZSBvdXIgYXBwLicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdGltZW91dDogNTAwMCxcclxuICAgICAgICAgICAgICAgIG1heGltdW1BZ2U6IDBcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oY2Jfc3VjY2VzcywgY2JfZXJyb3IsIG9wdGlvbnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHdhdGNoUG9zaXRpb24oKSB7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiX3N1Y2Nlc3MocG9zKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGxhdGl0dWRlIGFuZCBsb25naXR1ZGVcclxuICAgICAgICAgICAgICAgIF90aGlzLmxhdCA9IHBvcy5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5sbmcgPSBwb3MuY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgIF90aGlzLnZlbG9jaXR5ID0gcG9zLmNvb3Jkcy5zcGVlZDtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcmVjZW50Q29vcmRzID0ge2xhdDogX3RoaXMubGF0LCBsbmc6IF90aGlzLmxuZ307XHJcbiAgICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncmVjZW50Q29vcmRzJywgSlNPTi5zdHJpbmdpZnkocmVjZW50Q29vcmRzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLnRhcmdldC5sYXQgPT09IF90aGlzLmxhdCAmJiBfdGhpcy50YXJnZXQubG5nID09PSBfdGhpcy5sbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ29uZ3JhdHVsYXRpb25zLCB5b3UgaGF2ZSByZWFjaGVkIHlvdXIgZGVzdGluYXRpb24nKTtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uY2xlYXJXYXRjaChfdGhpcy53YXRjaGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBBUEkuc2V0Q29vcmRzKF90aGlzLmxuZywgX3RoaXMubGF0KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHBvcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNiX2Vycm9yKGVycikge1xyXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGxhdGl0dWRlIGFuZCBsb25naXR1ZGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRVJST1IoJyArIGVyci5jb2RlICsgJyk6ICcgKyBlcnIubWVzc2FnZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZXJyLmNvZGUgPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wZXJtaXNzaW9ucy5xdWVyeSh7J25hbWUnOiAnZ2VvbG9jYXRpb24nfSkudGhlbigocGVybWlzc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwZXJtaXNzaW9uLnN0YXRlID09ICdwcm9tcHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuZ2xvYmFsVmFyLmlzR1BTVHVybmVkT24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdQbGVhc2UgdHVybiBvbiB5b3VyIChHUFMpIExvY2F0aW9uIHNlcnZpY2UuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocGVybWlzc2lvbi5zdGF0ZSA9PSAnZGVuaWVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93Lmdsb2JhbFZhci5hY2Nlc3NPZkxvY2F0aW9uID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnUGxlYXNlIGFsbG93IHVzIHRvIGFjY2VzcyB5b3VyIChHUFMpIExvY2F0aW9uIHNlcnZpY2UgdG8gdXNlIG91ciBhcHAuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsXHJcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiA1MDAwLFxyXG4gICAgICAgICAgICAgICAgbWF4aW11bUFnZTogMFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgX3RoaXMud2F0Y2hlciA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKGNiX3N1Y2Nlc3MsIGNiX2Vycm9yLCBvcHRpb25zKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImV4cG9ydCBmdW5jdGlvbiBnZXRSYW5kb21JbnRJbmNsdXNpdmUobWluLCBtYXgpIHtcclxuICBtaW4gPSBNYXRoLmNlaWwobWluKTtcclxuICBtYXggPSBNYXRoLmZsb29yKG1heCk7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47IC8vVGhlIG1heGltdW0gaXMgaW5jbHVzaXZlIGFuZCB0aGUgbWluaW11bSBpcyBpbmNsdXNpdmUgXHJcbn0iLCJpbXBvcnQgVXNlciBmcm9tICcuL1VzZXInO1xyXG5pbXBvcnQgKiBhcyBBUEkgZnJvbSAnLi9hcGkuanMnO1xyXG5pbXBvcnQgKiBhcyBVSSBmcm9tICcuL3VpJztcclxuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuL1V0aWxpdHknO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmlkZXIgZXh0ZW5kcyBVc2VyIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5pc09ubGluZSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5kZWxheVRpbWUgPSAzMDAwO1xyXG5cdFx0dGhpcy5pbnRlcnZhbElEID0gMDtcclxuXHRcdHRoaXMudGltZW91dElEID0ge1xyXG5cdFx0XHRyaWRlQ29uZmlybWF0aW9uOiAwLFxyXG5cdFx0fTtcclxuXHRcdHRoaXMuZHVyYXRpb24gPSB7XHJcblx0XHRcdHJpZGVDb25maXJtYXRpb246IDEwICogMTAwMCxcclxuXHRcdFx0d2FpdGluZ0Fycml2YWxPZkRyaXZlcjogMTAgKiAxMDAwLFxyXG5cdFx0fTtcclxuXHRcdHRoaXMubWF0Y2hlZERyaXZlcklEID0gMDtcclxuXHRcdHRoaXMubWF0Y2hlZERyaXZlckluZm8gPSB7fTtcclxuXHRcdHRoaXMuZmFyZUluZm8gPSB7fTtcclxuXHRcdHRoaXMuYmV0SUQgPSAwO1xyXG5cdFx0Ly8gcmVxdWVzdEJ0blxyXG5cdH1cclxuXHJcblx0b25saW5lKCkge1xyXG5cdFx0Y29uc29sZS5sb2coJ1N0YXR1cyA6IFJFUVVFU1RJTkcnKTtcclxuXHRcdFVJLnBvcFNob3J0TXNnKCdTZWFyY2hpbmcgZm9yIG5lYXJieSBVQkVSLi4uJyk7XHJcblx0XHRVSS5zaG93T25saW5lSW5kaWNhdG9yKCk7XHJcblx0XHRVSS5jaGFuZ2VSZXF1ZXN0QnRuKCdNYXliZSBuZXh0IHRpbWUnLCAnb25saW5lJywgJ2MtYnRuLS1naG9zdCBjLWJ0bi0tdGVydGlhcnknLCAnYy1idG4tLXByaW1hcnknKTtcclxuXHRcdHRoaXMuY2hlY2tSZXF1ZXN0U3RhdHVzKCk7XHJcblx0fVxyXG5cclxuXHRvZmZsaW5lKCkge1xyXG5cdFx0Ly8gR2V0IGEgcmlkZVxyXG5cdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsSUQpO1xyXG5cdFx0Y29uc29sZS5sb2coJ1N0YXR1cyA6IE9GRkxJTkUnKTtcclxuXHRcdFVJLnBvcFNob3J0TXNnKCdZb3VcXCdyZSBub3cgb2ZmbGluZScpO1xyXG5cdFx0VUkuaGlkZU9ubGluZUluZGljYXRvcigpO1xyXG5cdFx0VUkuY2hhbmdlUmVxdWVzdEJ0bignR28gYSByaWRlJywgJ29mZmxpbmUnLCAnYy1idG4tLXByaW1hcnknLCAnYy1idG4tLWdob3N0IGMtYnRuLS10ZXJ0aWFyeScpO1xyXG5cdFx0VUkuZW5hYmxlUmVxdWVzdEJ0bigpO1xyXG5cdH1cclxuXHJcblx0Y2hlY2tSZXF1ZXN0U3RhdHVzKCkge1xyXG5cdFx0VUkuZW5hYmxlUmVxdWVzdEJ0bigpO1xyXG5cdFx0dGhpcy5jbGVhckxhc3REcml2ZXJJbmZvKCk7XHJcblx0XHR0aGlzLmNsZWFyRmFyZUluZm8oKTtcclxuXHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKCgpPT57XHJcblx0XHRcdF90aGlzLm5lYXJieURyaXZlcigpO1xyXG5cdFx0fSwgdGhpcy5kZWxheVRpbWUpO1xyXG5cdH1cclxuXHJcblx0bmVhcmJ5RHJpdmVyKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRBUEkubmVhcmJ5RHJpdmVyKCkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xyXG5cdFx0XHRsZXQgZHJpdmVycyA9IHJlcyB8fCBbXTtcclxuXHJcblx0XHRcdGxldCBtZXNzYWdlcyA9IFtcclxuXHRcdFx0XHQnUmVzdWx0IGlzIG9uIGl0XFwncyB3YXknLFxyXG5cdFx0XHRcdCdLZWVwIGNhbG0sIHJpZGUgc2FmZSEnLFxyXG5cdFx0XHRcdCdGaW5kaW5nIHlvdSB0aGUgYmVzdCBtYXRjaCcsXHJcblx0XHRcdFx0J1RoYW5rIHlvdSBmb3IgeW91ciBwYXRpZW5jZSdcclxuXHRcdFx0XTtcclxuXHRcdFx0bGV0IGkgPSBVdGlsLmdldFJhbmRvbUludEluY2x1c2l2ZSgwLCBtZXNzYWdlcy5sZW5ndGggLSAxKTtcclxuXHRcdFx0VUkucG9wU2hvcnRNc2cobWVzc2FnZXNbaV0pO1xyXG5cclxuXHRcdFx0aWYoZHJpdmVycy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChfdGhpcy5pbnRlcnZhbElEKTtcclxuXHRcdFx0XHRfdGhpcy5tYXRjaERyaXZlcihkcml2ZXJzKTtcclxuXHRcdFx0fVxyXG5cdFx0fSkuY2F0Y2goKGVycik9PntcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdFx0Y2xlYXJJbnRlcnZhbChfdGhpcy5pbnRlcnZhbElEKTtcclxuXHRcdFx0X3RoaXMub2ZmbGluZSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRtYXRjaERyaXZlcihkcml2ZXJJRHMpIHtcclxuXHRcdFVJLmRpc2FibGVSZXF1ZXN0QnRuKCk7XHJcblx0XHRVSS5wb3BTaG9ydE1zZygnRmluYWxpemluZyAmIHByZXBhcmluZyBkcml2ZXIgaW5mbycpO1xyXG5cclxuXHRcdGxldCBkcml2ZXJJRCA9IGRyaXZlcklEc1swXS5pZDtcclxuXHJcblx0XHRpZihkcml2ZXJJRHMubGVuZ3RoID4gMSl7XHJcblx0XHRcdGxldCBpID0gVXRpbC5nZXRSYW5kb21JbnRJbmNsdXNpdmUoMCwgZHJpdmVySURzLmxlbmd0aCAtIDEpO1xyXG5cdFx0XHRkcml2ZXJJRCA9IGRyaXZlcklEc1tpXS5pZDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmdldERyaXZlckRldGFpbHMoZHJpdmVySUQpO1xyXG5cdH1cclxuXHJcblx0Z2V0RHJpdmVyRGV0YWlscyhpZCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRBUEkuZHJpdmVyRGV0YWlscyhpZCkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRfdGhpcy5wcm9tcHRSaWRlKHJlcyk7XHJcblx0XHR9KS5jYXRjaCgoZXJyKT0+e1xyXG5cdFx0XHRjb25zb2xlLmxvZygnQ2F0Y2hlZCBlcnJvcjogJywgZXJyKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cHJvbXB0UmlkZShkcml2ZXJEZXRhaWxzKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cdFx0Ly8gbGV0IHByb2ZpbGVQaWMgPSBkcml2ZXJEZXRhaWxzLnByb2ZpbGVQaWMgfHwgJzxpIGNsYXNzPVwiZmEgZmEtMnggZmEtdXNlclwiPjwvaT4nO1xyXG5cdFx0bGV0IHByb2ZpbGVQaWMgPSAnPGltZyBzcmM9XCJodHRwOi8vaS5wcmF2YXRhci5jYy85NlwiIHN0eWxlPVwiYm9yZGVyLXJhZGl1czogNTAlO1wiIC8+JyB8fCAnPGkgY2xhc3M9XCJmYSBmYS0yeCBmYS11c2VyXCI+PC9pPic7XHJcblx0XHRsZXQge2lkOiBkcml2ZXJJRCwgbmFtZSwgcmF0aW5nLCBjYXJfcGxhdGU6IGNhck51bVBsYXRlLCBwaG9uZTogY29udGFjdE51bX0gPSBkcml2ZXJEZXRhaWxzO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XHJcblx0XHRcdHJldHVybiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGNhck1vZGVsID0gYCR7Y2FwaXRhbGl6ZShkcml2ZXJEZXRhaWxzLmNhcl9jb2xvcil9ICR7Y2FwaXRhbGl6ZShkcml2ZXJEZXRhaWxzLmNhcl9icmFuZCl9ICR7Y2FwaXRhbGl6ZShkcml2ZXJEZXRhaWxzLmNhcl9tb2RlbCl9YFxyXG5cclxuXHRcdGxldCBwcm9tcHRCb3ggPSBVSS5jdXN0b21Db25maXJtKHtcclxuXHRcdFx0dGl0bGU6ICdZb3UgZ290IGEgcmlkZSEgRG8geW91IHdhbnQgaXQ/JyxcclxuXHRcdFx0bWVzc2FnZTogYFxyXG5cdFx0XHRcdDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+XHJcblx0XHRcdFx0XHQ8cD4ke3Byb2ZpbGVQaWN9PC9wPlxyXG5cdFx0XHRcdFx0PHA+PGI+JHtjYXBpdGFsaXplKG5hbWUpfTwvYj48L3A+XHJcblx0XHRcdFx0XHQ8cD5cclxuXHRcdFx0XHRcdFx0PGRpdj4ke2Nhck51bVBsYXRlfTwvZGl2PlxyXG5cdFx0XHRcdFx0XHQ8c21hbGw+PGk+JHtjYXJNb2RlbH08L2k+PC9zbWFsbD5cclxuXHRcdFx0XHRcdDwvcD5cclxuXHRcdFx0XHRcdDxwIHN0eWxlPVwiY29sb3I6ICMxZmJhZDY7XCI+XHJcblx0XHRcdFx0XHRcdDxpIGNsYXNzPVwiZmEgZmEtbGcgZmEtc3RhclwiPjwvaT5cclxuXHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1sZyBmYS1zdGFyXCI+PC9pPlxyXG5cdFx0XHRcdFx0XHQ8aSBjbGFzcz1cImZhIGZhLWxnIGZhLXN0YXJcIj48L2k+XHJcblx0XHRcdFx0XHRcdDxpIGNsYXNzPVwiZmEgZmEtbGcgZmEtc3RhclwiPjwvaT5cclxuXHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJmYSBmYS1sZyBmYS1zdGFyLWhhbGYtb1wiPjwvaT5cclxuXHRcdFx0XHRcdFx0JHtyYXRpbmd9XHJcblx0XHRcdFx0XHQ8L3A+XHJcblx0XHRcdFx0XHQ8cCBzdHlsZT1cImNvbG9yOiAjODg4O1wiPjxpIGNsYXNzPVwiZmEgZmEtcGhvbmVcIj48L2k+ICR7Y29udGFjdE51bX08L3A+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdGAsXHJcblx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRjYW5jZWw6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiAnU0tJUCcsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdidG4tZGVmYXVsdCdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNvbmZpcm06IHtcclxuXHRcdFx0XHRcdGxhYmVsOiAnTGV0XFwncyBnbycsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdidG4taW5mbydcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjYWxsYmFjazogKHJlcyk9PntcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoX3RoaXMudGltZW91dElELnJpZGVDb25maXJtYXRpb24pO1xyXG5cclxuXHRcdFx0XHRpZihyZXMpe1xyXG5cdFx0XHRcdFx0X3RoaXMubWF0Y2hlZERyaXZlcklEID0gZHJpdmVySUQ7XHJcblx0XHRcdFx0XHRfdGhpcy5tYXRjaGVkRHJpdmVySW5mbyA9IGRyaXZlckRldGFpbHM7XHJcblx0XHRcdFx0XHRfdGhpcy5hY2NlcHRSaWRlKGRyaXZlcklEKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0X3RoaXMuZGVjbGluZVJpZGUoZHJpdmVySUQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy50aW1lb3V0SUQucmlkZUNvbmZpcm1hdGlvbiA9IHNldFRpbWVvdXQoKCk9PntcclxuXHRcdFx0XHJcblx0XHRcdHByb21wdEJveC5tb2RhbCgnaGlkZScpO1xyXG5cdFx0XHR0aGlzLmRlY2xpbmVSaWRlKGRyaXZlcklEKTtcclxuXHJcblx0XHR9LCB0aGlzLmR1cmF0aW9uLnJpZGVDb25maXJtYXRpb24pO1xyXG5cclxuXHR9XHJcblxyXG5cdGFjY2VwdFJpZGUoZHJpdmVySUQpIHtcclxuXHRcdGxldCBfdGhpcyA9IHRoaXM7XHJcblx0XHRcclxuXHRcdEFQSS5hY2NlcHRSaWRlKGRyaXZlcklEKS50aGVuKCgpPT57XHJcblx0XHRcdF90aGlzLndhaXRGb3JSZXNwb25jZU9mRHJpdmVyKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRlY2xpbmVSaWRlKGRyaXZlcklEKSB7XHJcblx0XHR0aGlzLmNoZWNrUmVxdWVzdFN0YXR1cygpO1xyXG5cdH1cclxuXHJcblxyXG5cdHdhaXRGb3JSZXNwb25jZU9mRHJpdmVyKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHR0aGlzLmludGVydmFsSUQgPSBzZXRJbnRlcnZhbCgoKT0+e1xyXG5cclxuXHRcdFx0QVBJLmNoZWNrUmlkZVN0YXR1cyhfdGhpcy5tYXRjaGVkRHJpdmVySUQpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgbWVzc2FnZXMgPSBbXHJcblx0XHRcdFx0XHQnV2FpdGluZyBmb3IgZHJpdmVyXFwncyByZXNwb25jZScsXHJcblx0XHRcdFx0XHQnU3RpbGwgd2FpdGluZy4uLicsXHJcblx0XHRcdFx0XHQnS2VlcCBjYWxtLCBzdGF5IHNhZmUhJyxcclxuXHRcdFx0XHRcdCdQbGVhc2UgaG9sZCBvbiB3aGlsZSBkcml2ZXIgcmVwbHknLFxyXG5cdFx0XHRcdFx0J1RoYW5rIHlvdSBmb3IgeW91ciBwYXRpZW5jZSdcclxuXHRcdFx0XHRdO1xyXG5cdFx0XHRcdGxldCBpID0gVXRpbC5nZXRSYW5kb21JbnRJbmNsdXNpdmUoMCwgbWVzc2FnZXMubGVuZ3RoIC0gMSk7XHJcblx0XHRcdFx0VUkucG9wU2hvcnRNc2cobWVzc2FnZXNbaV0pO1xyXG5cclxuXHRcdFx0XHQvLyA0ID0gcGVuZGluZywgNSA9IGFjY2VwdGVkLCA2ID0gcmVqZWN0ZWQsIDIwID0gYmV0dGluZ1xyXG5cdFx0XHRcdGlmKHJlcy5nZXRSaWRlU3RhdHVzID09IDIwKSB7XHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKF90aGlzLmludGVydmFsSUQpO1xyXG5cdFx0XHRcdFx0X3RoaXMucHJvbXB0VG9CZXQocmVzLmJldElEKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZihyZXMuZ2V0UmlkZVN0YXR1cyA9PSA1KSB7XHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKF90aGlzLmludGVydmFsSUQpO1xyXG5cdFx0XHRcdFx0X3RoaXMud2FpdEZvckFycml2YWxPZkRyaXZlcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmKHJlcy5nZXRSaWRlU3RhdHVzID09IDYpIHtcclxuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoX3RoaXMuaW50ZXJ2YWxJRCk7XHJcblx0XHRcdFx0XHRfdGhpcy5kcml2ZXJEZWNsaW5lZEpvYigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSwgdGhpcy5kZWxheVRpbWUpO1xyXG5cdH1cclxuXHJcblx0ZHJpdmVyRGVjbGluZWRKb2IoKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdFVJLmN1c3RvbUFsZXJ0KHtcclxuXHRcdFx0dGl0bGU6ICdSaWRlIGFib3J0ZWQnLFxyXG5cdFx0XHRtZXNzYWdlOiAnPHA+RHJpdmVyIG1heSBoYXZlIGRlY2xpbmVkIG9yIGZhaWxlZCB0byBhY2NlcHQgcmlkZSByZXF1ZXN0IGluIHRpbWUuPC9wPicsXHJcblx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRvazoge1xyXG5cdFx0XHRcdFx0bGFiZWw6ICdHb3QgaXQnLFxyXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiAnYnRuLWluZm8nXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRjYWxsYmFjazogX3RoaXMub2ZmbGluZVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHByb21wdFRvQmV0KGJldElEKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdFVJLmN1c3RvbURpYWxvZyh7XHJcblx0XHRcdHRpdGxlOiAnQmV0dGluZyBSZXF1aXJlZCcsXHJcblx0XHRcdG1lc3NhZ2U6IGBcclxuXHRcdFx0XHQ8aDQ+QmV0IHRvIGdldCB0aGlzIHJpZGUhPC9oND5cclxuXHRcdFx0XHQ8cD5TYW1lIGRyaXZlciBpcyByZXF1ZXN0ZWQgYnkgb3RoZXIgdXNlcihzKTwvcD5cclxuXHRcdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdFx0PGlucHV0IHR5cGU9XCJudW1iZXJcIiBpZD1cImJldEFtb3VudFwiIGNsYXNzPVwiYm9vdGJveC1pbnB1dCBib290Ym94LWlucHV0LW51bWJlciBmb3JtLWNvbnRyb2xcIiBtaW49XCIxXCIgbWF4PVwiMTBcIiBzdGVwPVwiMC4xXCIgcGxhY2Vob2xkZXI9XCIobWluLikgJDEuMDAgLS0gJDEwLjAwIChtYXguKVwiIC8+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdGAgLFxyXG5cdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0Y2FuY2VsOiB7XHJcblx0XHRcdFx0XHRsYWJlbDogJ0dpdmUgdXAnLFxyXG5cdFx0XHRcdFx0Y2xhc3NOYW1lOiBcImJ0bi1kZWZhdWx0XCIsXHJcblx0XHRcdFx0XHRjYWxsYmFjazogKCk9PntcclxuXHRcdFx0XHRcdFx0X3RoaXMuZ2l2ZVVwQmV0KGJldElEKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGNvbmZpcm06IHtcclxuXHRcdFx0XHRcdGxhYmVsOiAnUGxhY2UgYmV0JyxcclxuXHRcdFx0XHRcdGNsYXNzTmFtZTogXCJidG4taW5mb1wiLFxyXG5cdFx0XHRcdFx0Y2FsbGJhY2s6ICgpPT57XHJcblx0XHRcdFx0XHRcdGxldCBiZXRBbW91bnQgPSAkKCcjYmV0QW1vdW50JykudmFsKCk7XHJcblx0XHRcdFx0XHRcdF90aGlzLnBsYWNlQmV0KGJldElELCBiZXRBbW91bnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwbGFjZUJldChiZXRJRCwgYW1vdW50KSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdEFQSS5wbGFjZUJldChiZXRJRCwgYW1vdW50KS50aGVuKChyZXMpPT57XHJcblx0XHRcdGlmKHJlcy53aW5uZXIgPCAwKSB7XHJcblx0XHRcdFx0X3RoaXMuY2hlY2tCZXRSZXN1bHQoYmV0SUQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmKHJlcy5pc1dpbikge1xyXG5cdFx0XHRcdFx0X3RoaXMud2luQmV0KCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdF90aGlzLmxvc2VCZXQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Z2l2ZVVwQmV0KGJldElEKSB7XHJcblx0XHRVSS5wb3BTaG9ydE1zZygnU2VhcmNoaW5nIGZvciBvdGhlciBVYmVyIGRyaXZlcicpO1xyXG5cdFx0dGhpcy5jaGVja1JlcXVlc3RTdGF0dXMoKTtcclxuXHR9XHJcblxyXG5cdGNoZWNrQmV0UmVzdWx0KGJldElEKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuYmV0SUQgPSBiZXRJRDtcclxuXHJcblx0XHR0aGlzLmludGVydmFsSUQgPSBzZXRJbnRlcnZhbCgoKT0+e1xyXG5cclxuXHRcdFx0QVBJLmNoZWNrQmV0UmVzdWx0KGJldElEKS50aGVuKChyZXMpPT57XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0bGV0IG1lc3NhZ2VzID0gW1xyXG5cdFx0XHRcdFx0J1dhaXRpbmcgZm9yIG90aGVyIHVzZXIuLi4nLFxyXG5cdFx0XHRcdFx0J1N0aWxsIHdhaXRpbmcuLi4nLFxyXG5cdFx0XHRcdFx0J0tlZXAgY2FsbSwgc3RheSBzYWZlIScsXHJcblx0XHRcdFx0XHQnUGxlYXNlIGhvbGQgb24gd2hpbGUgb3RoZXJzIGFyZSBiZXR0aW5nJyxcclxuXHRcdFx0XHRcdCdUaGFuayB5b3UgZm9yIHlvdXIgcGF0aWVuY2UnLFxyXG5cdFx0XHRcdF07XHJcblx0XHRcdFx0bGV0IGkgPSBVdGlsLmdldFJhbmRvbUludEluY2x1c2l2ZSgwLCBtZXNzYWdlcy5sZW5ndGggLSAxKTtcclxuXHRcdFx0XHRVSS5wb3BTaG9ydE1zZyhtZXNzYWdlc1tpXSk7XHJcblxyXG5cdFx0XHRcdGlmKHJlcy53aW5uZXIgPiAwKSB7XHJcblx0XHRcdFx0XHRjbGVhckludGVydmFsKF90aGlzLmludGVydmFsSUQpO1xyXG5cdFx0XHRcdFx0aWYocmVzLmlzV2luKSB7XHJcblx0XHRcdFx0XHRcdF90aGlzLndpbkJldCgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0X3RoaXMubG9zZUJldCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fSwgdGhpcy5kZWxheVRpbWUpO1xyXG5cdH1cclxuXHJcblx0d2luQmV0KCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRVSS5jdXN0b21EaWFsb2coe1xyXG5cdFx0XHR0aXRsZTogJ0hvb3JheSEnLFxyXG5cdFx0XHRtZXNzYWdlOiBgPGg0PllvdSBoYXZlIHdvbiB0aGUgYmV0LjwvaDQ+XHJcblx0XHRcdDxwPlBsZWFzZSB3YWl0IHdoaWxlIHlvdXIgVWJlciBpcyBvbiBpdCdzIHdheS4gSGF2ZSBhIGdyZWF0IGRheSE8L3A+YCxcclxuXHRcdFx0YnV0dG9uczoge1xyXG5cdFx0XHRcdG9rOiB7XHJcblx0XHRcdFx0XHRsYWJlbDogJ0dyZWF0IScsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdidG4taW5mbycsXHJcblx0XHRcdFx0XHRjYWxsYmFjazogKCk9PntcclxuXHRcdFx0XHRcdFx0X3RoaXMud2FpdEZvckFycml2YWxPZkRyaXZlcigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRsb3NlQmV0KCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRVSS5jdXN0b21EaWFsb2coe1xyXG5cdFx0XHR0aXRsZTogJ1NvcnJ5Li4uJyxcclxuXHRcdFx0bWVzc2FnZTogYDxoND5Zb3UgaGF2ZSBsb3N0IHRoZSBiZXQuPC9oND5cclxuXHRcdFx0PHA+RG9uJ3Qgd29ycnkgeW91IHdpbGwgZ2V0IGEgPGI+NSUgZGlzY291bnQ8L2I+IG9uIHRoZSBuZXh0IHJpZGUuIENoZWVyIHVwITwvcD5gLFxyXG5cdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0b2s6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiAnR3JlYXQhJyxcclxuXHRcdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1pbmZvJyxcclxuXHRcdFx0XHRcdGNhbGxiYWNrOiAoKT0+e1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5vZmZsaW5lKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdHdhaXRGb3JBcnJpdmFsT2ZEcml2ZXIoKSB7XHJcblxyXG5cdFx0VUkuY2hhbmdlUmVxdWVzdEJ0bignUGlja2VkIHVwJywgJ3dhaXRpbmdEcml2ZXInLCAnYy1idG4tLXByaW1hcnknLCAnYy1idG4tLWdob3N0IGMtYnRuLS10ZXJ0aWFyeScpO1xyXG5cdFx0VUkuZW5hYmxlUmVxdWVzdEJ0bigpO1xyXG5cclxuXHRcdHRoaXMuaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKCgpPT57XHJcblx0XHRcdGxldCBtZXNzYWdlcyA9IFtcclxuXHRcdFx0XHQnWW91IG1heSBzZWUgeW91ciBVYmVyIGlzIG9uIGl0XFwncyB3YXknLFxyXG5cdFx0XHRcdCdTdGlsbCB3YWl0aW5nLi4uJyxcclxuXHRcdFx0XHQnS2VlcCBjYWxtLCBzdGF5IHNhZmUhJyxcclxuXHRcdFx0XHQnQWdhaW4sIHRoYW5rcyBmb3IgeW91ciBwYXRpZW5jZScsXHJcblx0XHRcdFx0J0RyaXZlciBvbiB0aGUgd2F5JyxcclxuXHRcdFx0XTtcclxuXHJcblx0XHRcdGxldCBpID0gVXRpbC5nZXRSYW5kb21JbnRJbmNsdXNpdmUoMCwgbWVzc2FnZXMubGVuZ3RoIC0gMSk7XHJcblx0XHRcdFxyXG5cdFx0XHRVSS5wb3BTaG9ydE1zZyhtZXNzYWdlc1tpXSk7XHJcblxyXG5cdFx0fSwgdGhpcy5kdXJhdGlvbi53YWl0aW5nQXJyaXZhbE9mRHJpdmVyKTtcclxuXHR9XHJcblxyXG5cdHBpY2tlZFVwQnlEcml2ZXIoKSB7XHJcblx0XHRVSS5jaGFuZ2VSZXF1ZXN0QnRuKCdTYWZlbHkgYXJyaXZlZCcsICdvblRoZVJvYWQnLCAnYy1idG4tLWdob3N0IGMtYnRuLS10ZXJ0aWFyeScsICdjLWJ0bi0tcHJpbWFyeScpO1xyXG5cdH1cclxuXHJcblx0cmVhY2hlZERlc3RpbmF0aW9uKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHRcdEFQSS5nZXRGYXJlSW5mbygpLnRoZW4oKGZhcmVJbmZvKT0+e1xyXG5cclxuXHRcdFx0bGV0IGZhcmVJRCA9IGZhcmVJbmZvLmlkO1xyXG5cdFx0XHRsZXQgcHJpY2UgPSBwYXJzZUZsb2F0KGZhcmVJbmZvLnByaWNlKTtcclxuXHRcdFx0bGV0IGJldEFtb3VudCA9IHBhcnNlRmxvYXQoZmFyZUluZm8uYmV0X2Ftb3VudCk7XHJcblxyXG5cdFx0XHRVSS5jdXN0b21EaWFsb2coe1xyXG5cdFx0XHRcdHRpdGxlOiAnSG9wZSB5b3UgZW5qb3kgdGhlIHJpZGUhJyxcclxuXHRcdFx0XHRtZXNzYWdlOiBgPGg0PlRoZSB0b3RhbCBmYXJlIG9mIHRoaXMgdHJpcCBpcyAkJHtwcmljZSArIGJldEFtb3VudH0gJHsoXHJcblx0XHRcdFx0XHQoYmV0QW1vdW50ID4gMCkgPyBgKCR7cHJpY2V9ICsgJHtiZXRBbW91bnR9KWA6ICcnXHJcblx0XHRcdFx0KX08L2g0PlxyXG5cdFx0XHRcdDxwPlBsZWFzZSBwYXkgYnkgY2FzaDwvcD5gLFxyXG5cdFx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRcdG9rOiB7XHJcblx0XHRcdFx0XHRcdGxhYmVsOiAnT2theScsXHJcblx0XHRcdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1pbmZvJyxcclxuXHRcdFx0XHRcdFx0Y2FsbGJhY2s6ICgpPT57XHJcblx0XHRcdFx0XHRcdFx0QVBJLnJlYWNoZWREZXN0aW5hdGlvbihmYXJlSUQpO1xyXG5cdFx0XHRcdFx0XHRcdF90aGlzLm9mZmxpbmUoKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjbGVhckxhc3REcml2ZXJJbmZvKCkge1xyXG5cdFx0dGhpcy5tYXRjaGVkRHJpdmVySUQgPSAwO1xyXG5cdFx0dGhpcy5tYXRjaGVkRHJpdmVySW5mbyA9IHt9O1xyXG5cdH1cclxuXHRcclxuXHRjbGVhckZhcmVJbmZvKCkge1xyXG5cdFx0dGhpcy5mYXJlSW5mbyA9IHt9O1xyXG5cdH1cclxufSIsImltcG9ydCBVc2VyIGZyb20gJy4vVXNlcic7XHJcbmltcG9ydCAqIGFzIEFQSSBmcm9tICcuL2FwaSc7XHJcbmltcG9ydCAqIGFzIFVJIGZyb20gJy4vdWknO1xyXG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4vVXRpbGl0eSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcml2ZXIgZXh0ZW5kcyBVc2VyIHtcclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHN1cGVyKCk7XHJcblxyXG5cdFx0dGhpcy5pc09ubGluZSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5pbnRlcnZhbElEID0gMDtcclxuXHRcdHRoaXMuZGVsYXlUaW1lID0gMjAwMDtcclxuXHRcdHRoaXMudGltZW91dElEID0ge1xyXG5cdFx0XHRqb2JDb25maXJtYXRpb246IDAsXHJcblx0XHRcdC8vIGJldFJlc3VsdFJldHJpZXZhbDogMCwgLy8gZG9uJ3QgbmVlZCwgY2F1c2UgbXVzdCB3YWl0IGZvciBpdCB0byB0aW1lb3V0XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5kdXJhdGlvbiA9IHtcclxuXHRcdFx0am9iQ29uZmlybWF0aW9uOiAxNSAqIDEwMDAsXHJcblx0XHRcdGJldFJlc3VsdFJldHJpZXZhbDogMiAqIDEwMDAsXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5tYXRjaGVkUmlkZXJJbmZvID0ge307XHJcblx0XHR0aGlzLmZhcmVJbmZvID0ge307XHJcblx0XHR0aGlzLmJldElEID0gMDtcclxuXHRcdC8vIG9ubGluZUJ0blxyXG5cdFx0d2luZG93Ll9VSSA9IFVJO1xyXG5cdH1cclxuXHJcblx0Ly8gQXZhaWxhYmlsaXR5XHJcblx0b25saW5lKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRBUEkub25saW5lKCkudGhlbigoKT0+e1xyXG5cdFx0XHRjb25zb2xlLmxvZygnU3RhdHVzIDogT05MSU5FJyk7XHJcblx0XHRcdFVJLnBvcFNob3J0TXNnKCdXYWl0aW5nIGZvciByZXF1ZXN0Li4uJyk7XHJcblx0XHRcdFVJLnNob3dPbmxpbmVJbmRpY2F0b3IoKTtcclxuXHRcdFx0VUkuY2hhbmdlT25saW5lQnRuKCdHbyBvZmZsaW5lJywgJ29ubGluZScsICdjLWJ0bi0tZ2hvc3QgYy1idG4tLXRlcnRpYXJ5JywgJ2MtYnRuLS1wcmltYXJ5Jyk7XHJcblx0XHRcdF90aGlzLmNoZWNrSm9iKCk7XHJcblx0XHR9KS5jYXRjaCgoZXJyKT0+e1xyXG5cdFx0XHRVSS5oaWRlT25saW5lSW5kaWNhdG9yKCk7XHJcblx0XHRcdFVJLmNoYW5nZU9ubGluZUJ0bignR28gb25saW5lJywgJ29mZmxpbmUnLCAnYy1idG4tLXByaW1hcnknLCAnYy1idG4tLWdob3N0IGMtYnRuLS10ZXJ0aWFyeScpO1xyXG5cdFx0XHRVSS5lbmFibGVPbmxpbmVCdG4oKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0b2ZmbGluZSgpIHtcclxuXHRcdGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbElEKTtcclxuXHRcdEFQSS5vZmZsaW5lKCkudGhlbigoKT0+e1xyXG5cdFx0XHRjb25zb2xlLmxvZygnU3RhdHVzIDogT0ZGTElORScpO1xyXG5cdFx0XHRVSS5wb3BTaG9ydE1zZygnWW91XFwncmUgbm93IG9mZmxpbmUnKTtcclxuXHRcdFx0VUkuaGlkZU9ubGluZUluZGljYXRvcigpO1xyXG5cdFx0XHRVSS5jaGFuZ2VPbmxpbmVCdG4oJ0dvIG9ubGluZScsICdvZmZsaW5lJywgJ2MtYnRuLS1wcmltYXJ5JywgJ2MtYnRuLS1naG9zdCBjLWJ0bi0tdGVydGlhcnknKTtcclxuXHRcdFx0VUkuZW5hYmxlT25saW5lQnRuKCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyBKb2JzXHJcblx0Y2hlY2tKb2IoKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKCgpPT57XHJcblx0XHRcdEFQSS5jaGVja0pvYigpLnRoZW4oKHJlcyk9PntcclxuXHJcblx0XHRcdFx0bGV0IG1lc3NhZ2VzID0gW1xyXG5cdFx0XHRcdFx0J1BsZWFzZSB3YWl0IHdoaWxlIHNlYXJjaGluZyBmb3IgcmlkZScsXHJcblx0XHRcdFx0XHQnS2VlcCBjYWxtLCBkcml2ZSBzYWZlIScsXHJcblx0XHRcdFx0XHQnQXJlIHlvdXIgY2FyIGluIG9wdGltdW0gY29uZGl0aW9uPycsXHJcblx0XHRcdFx0XHQnUmVtZW1iZXIgdG8gY2hlY2sgeW91ciBmdWVsJyxcclxuXHRcdFx0XHRcdCdUaGFuayB5b3UgZm9yIHlvdXIgcGF0aWVuY2UnXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0XHRsZXQgaSA9IFV0aWwuZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIG1lc3NhZ2VzLmxlbmd0aCAtIDEpO1xyXG5cdFx0XHRcdFVJLnBvcFNob3J0TXNnKG1lc3NhZ2VzW2ldKTtcclxuXHJcblx0XHRcdFx0aWYocmVzLmpvYnMpIHtcclxuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoX3RoaXMuaW50ZXJ2YWxJRCk7XHJcblx0XHRcdFx0XHRfdGhpcy5wcm9tcHRKb2IoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9KS5jYXRjaCgoZXJyKT0+e1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbChfdGhpcy5pbnRlcnZhbElEKTtcclxuXHRcdFx0XHRfdGhpcy5vZmZsaW5lKCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSwgdGhpcy5kZWxheVRpbWUpO1xyXG5cdH1cclxuXHJcblx0cHJvbXB0Sm9iKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHRcdFxyXG5cdFx0VUkuZGlzYWJsZU9ubGluZUJ0bigpO1xyXG5cclxuXHRcdGxldCBkaWFsb2dCb3ggPSBVSS5jdXN0b21EaWFsb2coe1xyXG5cdFx0XHRtZXNzYWdlOiAnTmV3IEpvYiBSZXF1ZXN0IScsXHJcblx0XHRcdGJ1dHRvbnM6IHtcclxuXHRcdFx0XHRjYW5jZWw6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiAnTm8sIHRoYW5rcycsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdidG4tZGVmYXVsdCcsXHJcblx0XHRcdFx0XHRjYWxsYmFjazogKCk9PntcclxuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KF90aGlzLnRpbWVvdXRJRC5qb2JDb25maXJtYXRpb24pO1xyXG5cdFx0XHRcdFx0XHRfdGhpcy5kZWNsaW5lSm9iKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRjb25maXJtOiB7XHJcblx0XHRcdFx0XHRsYWJlbDogJ0xldFxcJ3MgZ28hJyxcclxuXHRcdFx0XHRcdGNsYXNzTmFtZTogJ2J0bi1pbmZvJyxcclxuXHRcdFx0XHRcdGNhbGxiYWNrOiAoKT0+e1xyXG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoX3RoaXMudGltZW91dElELmpvYkNvbmZpcm1hdGlvbik7XHJcblx0XHRcdFx0XHRcdF90aGlzLmFjY2VwdEpvYigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHR0aGlzLnRpbWVvdXRJRC5qb2JDb25maXJtYXRpb24gPSBzZXRUaW1lb3V0KCgpPT57XHJcblx0XHRcdC8vIERlY2xpbmUgam9iIGlmIG5vIHJlcGx5XHJcblx0XHRcdGRpYWxvZ0JveC5tb2RhbCgnaGlkZScpO1xyXG5cdFx0XHRfdGhpcy5kZWNsaW5lSm9iKCk7XHJcblx0XHR9LCB0aGlzLmR1cmF0aW9uLmpvYkNvbmZpcm1hdGlvbik7XHJcblx0fVxyXG5cclxuXHRhY2NlcHRKb2IoKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cdFx0QVBJLmFjY2VwdEpvYigpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0aWYocmVzLmlzX2JldHRpbmcpIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRVSS5jdXN0b21BbGVydCgnWW91IGFyZSBvbiBkZW1hbmQhIFBsZWFzZSB3YWl0IHdoaWxlIHJpZGVyIGlzIGJldHRpbmcuJyk7XHJcblxyXG5cdFx0XHRcdHNldFRpbWVvdXQoKCk9PntcclxuXHJcblx0XHRcdFx0XHRfdGhpcy5jaGVja0JldFJlc3VsdChyZXMuYmV0X2lkKTtcclxuXHJcblx0XHRcdFx0fSwgX3RoaXMuZHVyYXRpb24uYmV0UmVzdWx0UmV0cmlldmFsKTtcclxuXHJcblx0XHRcdFx0X3RoaXMuYmV0SUQgPSByZXMuYmV0X2lkO1xyXG5cdFx0XHR9IFxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRfdGhpcy5nZXRSaWRlckluZm8ocmVzLnJpZGVyX2lkKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkZWNsaW5lSm9iKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRBUEkuZGVjbGluZUpvYigpLnRoZW4oKCk9PntcclxuXHRcdFx0X3RoaXMub2ZmbGluZSgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gQmV0dGluZ1xyXG5cdGNoZWNrQmV0UmVzdWx0KGJldElEKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdHRoaXMuaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKCgpPT57XHJcblx0XHRcdEFQSS5kcml2ZXJHZXRCZXRSZXN1bHQoYmV0SUQpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgbWVzc2FnZXMgPSBbXHJcblx0XHRcdFx0XHQnUmVzdWx0IGlzIG9uIGl0XFwncyB3YXknLFxyXG5cdFx0XHRcdFx0J0tlZXAgY2FsbSwgZHJpdmUgc2FmZSEnLFxyXG5cdFx0XHRcdFx0J0FyZSB5b3UgcmVhZHkgZm9yIHBpY2sgdXA/JyxcclxuXHRcdFx0XHRcdCdUaGFuayB5b3UgZm9yIHlvdXIgcGF0aWVuY2UnXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0XHRsZXQgaSA9IFV0aWwuZ2V0UmFuZG9tSW50SW5jbHVzaXZlKDAsIG1lc3NhZ2VzLmxlbmd0aCAtIDEpO1xyXG5cdFx0XHRcdFVJLnBvcFNob3J0TXNnKG1lc3NhZ2VzW2ldKTtcclxuXHJcblx0XHRcdFx0aWYocmVzLndpbm5lciA+IDApIHtcclxuXHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoX3RoaXMuaW50ZXJ2YWxJRCk7XHJcblx0XHRcdFx0XHRfdGhpcy5nZXRSaWRlckluZm8ocmVzLndpbm5lcik7XHJcblx0XHRcdFx0XHRVSS5wb3BTaG9ydE1zZygnRmluYWxpemluZyAmIHByZXBhcmluZyByaWRlciBpbmZvJyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSkuY2F0Y2goKGVycik9PntcclxuXHRcdFx0XHRjbGVhckludGVydmFsKF90aGlzLmludGVydmFsSUQpO1xyXG5cdFx0XHRcdHRoaXMub2ZmbGluZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sIHRoaXMuZGVsYXlUaW1lKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gUmlkZVxyXG5cdGdldFJpZGVySW5mbyhyaWRlcklEKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cdFx0XHJcblx0XHRBUEkuZ2V0UmlkZXJJbmZvKHJpZGVySUQpLnRoZW4oKHJlcyk9PntcclxuXHRcdFx0bGV0IHJpZGVyID0gcmVzLnJpZGVyO1xyXG5cdFx0XHRsZXQgY29vcmRzID0ge1xyXG5cdFx0XHRcdGxhdDogcGFyc2VGbG9hdChyaWRlci5sYXRpdHVkZSksXHJcblx0XHRcdFx0bG5nOiBwYXJzZUZsb2F0KHJpZGVyLmxvbmdpdHV0ZSksXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGdNYXAuZ2V0QWRkcmVzc0Zyb21MYXRMbmcoY29vcmRzKS50aGVuKChhZGRyKT0+e1xyXG5cdFx0XHRcdHJpZGVyLmxvY2F0aW9uQWRkcmVzcyA9IGFkZHI7XHJcblx0XHRcdFx0X3RoaXMucHJvbXB0UmlkZXJJbmZvKHJpZGVyKTtcclxuXHJcblx0XHRcdFx0VUkuY2hhbmdlT25saW5lQnRuKCdQaWNrZWQgdXAnLCAncGlja2luZ1VwJywgJycsJ2MtYnRuLS1naG9zdCcpO1xyXG5cdFx0XHRcdFVJLmVuYWJsZU9ubGluZUJ0bigpO1xyXG5cclxuXHRcdFx0XHRfdGhpcy5tYXRjaGVkUmlkZXJJbmZvID0gcmlkZXI7XHJcblx0XHRcdFx0X3RoaXMudGFyZ2V0ID0gY29vcmRzO1xyXG5cdFx0XHR9KS5jYXRjaCgoZXJyKT0+e1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRwcm9tcHRSaWRlckluZm8oaW5mbykge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHRcdC8vIGxldCBwcm9maWxlUGljID0gaW5mby5wcm9maWxlUGljIHx8ICc8aSBjbGFzcz1cImZhIGZhLTJ4IGZhLXVzZXJcIj48L2k+JztcclxuXHRcdGxldCBwcm9maWxlUGljID0gJzxpbWcgc3JjPVwiaHR0cDovL2kucHJhdmF0YXIuY2MvOTZcIiBzdHlsZT1cImJvcmRlci1yYWRpdXM6IDUwJTtcIiAvPicgfHwgJzxpIGNsYXNzPVwiZmEgZmEtMnggZmEtdXNlclwiPjwvaT4nO1xyXG5cdFx0bGV0IHtuYW1lLCBsb2NhdGlvbkFkZHJlc3MsIHBob25lOiBjb250YWN0TnVtfSA9IGluZm87XHJcblxyXG5cdFx0ZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcclxuXHRcdFx0cmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcclxuXHRcdH1cclxuXHJcblx0XHRVSS5jdXN0b21EaWFsb2coe1xyXG5cdFx0XHR0aXRsZTogJ1JpZGVyXFwncyBJbmZvJyxcclxuXHRcdFx0bWVzc2FnZTogYFxyXG5cdFx0XHRcdDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7XCI+XHJcblx0XHRcdFx0XHQ8cD4ke3Byb2ZpbGVQaWN9PC9wPlxyXG5cdFx0XHRcdFx0PHA+PGI+JHtjYXBpdGFsaXplKG5hbWUpfTwvYj48L3A+XHJcblx0XHRcdFx0XHQ8cD48aT4ke2xvY2F0aW9uQWRkcmVzc308L2k+PC9wPlxyXG5cdFx0XHRcdFx0PHAgc3R5bGU9XCJjb2xvcjogIzg4ODtcIj48aSBjbGFzcz1cImZhIGZhLXBob25lXCI+PC9pPiAke2NvbnRhY3ROdW19PC9wPlxyXG5cdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRgLFxyXG5cdFx0XHRidXR0b25zOiB7XHJcblx0XHRcdFx0b2s6IHtcclxuXHRcdFx0XHRcdGxhYmVsOiAnT2theScsXHJcblx0XHRcdFx0XHRjbGFzc05hbWU6ICdidG4taW5mbycsXHJcblx0XHRcdFx0XHRjYWxsYmFjazogKCk9PntcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ2JsYWJsYWJsYScpO1xyXG5cdFx0XHRcdFx0XHRVSS5lbmFibGVPbmxpbmVCdG4oKTtcclxuXHRcdFx0XHRcdFx0X3RoaXMubWluaW1pemVVc2VySW5mbygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdG1pbmltaXplVXNlckluZm8oKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGdNYXAuZ2V0RGlyZWN0aW9uKF90aGlzLnRhcmdldCk7XHJcblx0fVxyXG5cclxuXHRwaWNrZWRVcFJpZGVyKCkge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHRcdFVJLmN1c3RvbVByb21wdCgnUGxlYXNlIGVudGVyIHJpZGVyXFwncyBkZXN0aW5hdGlvbicsIChyZXMpPT57XHJcblx0XHRcdGlmKHJlcykge1xyXG5cdFx0XHRcdF90aGlzLnNldERlc3RpbmF0aW9uKHJlcyk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHRzZXREZXN0aW5hdGlvbihkZXN0aW5hdGlvbikge1xyXG5cdFx0bGV0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRnTWFwLmdldExhdExuZ0Zyb21BZGRyZXNzKGRlc3RpbmF0aW9uKS50aGVuKChsb2NhdGlvbik9PntcclxuXHRcdFx0X3RoaXMudGFyZ2V0ID0gbG9jYXRpb247XHJcblx0XHRcdGNvbnNvbGUubG9nKCdsb2NhdGlvbjogJyxsb2NhdGlvbik7XHJcblxyXG5cdFx0XHRnTWFwLmdldERpcmVjdGlvbihfdGhpcy50YXJnZXQpO1xyXG5cclxuXHRcdFx0VUkuY2hhbmdlT25saW5lQnRuKCdEcm9wcGVkIG9mZicsICdmZXRjaGluZ1JpZGVyJywgJ2MtYnRuLS1naG9zdCcsICcnKTtcclxuXHRcdFx0VUkuZW5hYmxlT25saW5lQnRuKCk7XHJcblx0XHRcdFxyXG5cdFx0fSkudGhlbigoKT0+e1xyXG5cdFx0XHRsZXQgcmlkZXJJRCA9IF90aGlzLm1hdGNoZWRSaWRlckluZm8uaWQ7XHJcblx0XHRcdGxldCB7bGF0LCBsbmd9ID0gX3RoaXMudGFyZ2V0O1xyXG5cdFx0XHRsZXQgYmV0SUQgPSBfdGhpcy5iZXRJRDtcclxuXHJcblx0XHRcdEFQSS5zZXRSaWRlckRlc3RpbmF0aW9uKHJpZGVySUQsIGxuZywgbGF0LCBiZXRJRCkudGhlbigocmVzKT0+e1xyXG5cdFx0XHRcdGxldCBfdGhpcyA9IHRoaXM7XHJcblx0XHRcdFx0X3RoaXMuZmFyZUluZm8gPSB7XHJcblx0XHRcdFx0XHRkaXN0YW5jZTogcmVzLmRpc3RhbmNlLFxyXG5cdFx0XHRcdFx0cmF0ZTogcmVzLmZhcmVfcmF0ZSxcclxuXHRcdFx0XHRcdHByaWNlOiBwYXJzZUZsb2F0KHJlcy5wcmljZSksXHJcblx0XHRcdFx0XHRiZXRBbW91bnQ6IHBhcnNlRmxvYXQocmVzLmJldF9hbW91bnQpLFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH0pO1xyXG5cdFx0fSkuY2F0Y2goKGVycik9PntcclxuXHRcdFx0Y29uc29sZS5sb2coZXJyKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZHJvcHBlZE9mZlJpZGVyKCkge1xyXG5cdFx0Z01hcC5yZUluaXRNYXAoKTtcclxuXHRcdHRoaXMub2ZmbGluZSgpO1xyXG5cdH1cclxuXHJcbn0iLCJpbXBvcnQgdGhlbWUgZnJvbSAnLi4vdGhlbWUuanNvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHTWFwIHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBjb29yZHMgPSBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5yZWNlbnRDb29yZHMpIHx8IHtsYXQ6IDAsIGxuZzogMH0pIHtcclxuICAgICAgICB0aGlzLkdPT0dMRV9BUElfVVJMID0gJ2h0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcyc7XHJcbiAgICAgICAgdGhpcy5HT09HTEVfQVBJX0tFWSA9ICdBSXphU3lEQTVNeTJPME5URTR6MXYzdTRDY1VuYlJSN3BVLVdnZzQnO1xyXG5cclxuICAgICAgICB0aGlzLm1hcCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5tYXJrZXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMubWFwQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgICAgIHRoaXMubWFwT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgY2VudGVyOiBjb29yZHMsIC8vICpyZXF1aXJlZFxyXG4gICAgICAgICAgICB6b29tOiAxNywgLy8gKnJlcXVpcmVkXHJcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWUsXHJcbiAgICAgICAgICAgIGdlc3R1cmVIYW5kbGluZzogJ2dyZWVkeScsXHJcbiAgICAgICAgICAgIC8vIHN0eWxlczogdGhlbWUubmlnaHQsIC8vIHRoZW1lLm5pZ2h0LFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwJyxcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZW9jb2RlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemUgdG8gR0VUIHNjcmlwdHMgZm9yIGdvb2dsZS5tYXBzIG9iamVjdFxyXG4gICAgICAgIHRoaXMuaW5pdEdvb2dsZU1hcEFQSSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRDQigpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnKG5vdCB1c2luZykgYmN6IEluaXRDQiBjYWxsZWQgdG9vIGZhc3QsIGJlZm9yZSBBSkFYIHJlc3BvbnNlIGlzIHJldHVybmVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEdvb2dsZU1hcEFQSSgpIHtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdGhpcy5HT09HTEVfQVBJX1VSTCxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAga2V5OiB0aGlzLkdPT0dMRV9BUElfS0VZLFxyXG4gICAgICAgICAgICAgICAgc2Vuc29yOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMuaW5pdENCXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnc2NyaXB0JyxcclxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnR29vZ2xlIE1hcCBBUEkgSW5pdGlhbGl6ZWQnKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmluaXRNYXAoKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmluaXRHZW9jb2RlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdE1hcCgpIHtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICBfdGhpcy5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKF90aGlzLm1hcENvbnRhaW5lciwgX3RoaXMubWFwT3B0aW9ucyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ01hcCBJbml0aWFsaXplZCcpO1xyXG5cclxuICAgICAgICBfdGhpcy5tYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgcG9zaXRpb246IF90aGlzLm1hcE9wdGlvbnMuY2VudGVyLFxyXG4gICAgICAgICAgICBtYXA6IF90aGlzLm1hcFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlSW5pdE1hcCgpIHtcclxuICAgICAgICB0aGlzLmluaXRNYXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0R2VvY29kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5nZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcjtcclxuICAgIH1cclxuXHJcbiAgICBpbml0RGlzdGFuY2VTZXJ2aWNlKCkge1xyXG4gICAgICAgIHRoaXMuZGlzdGFuY2VTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpc3RhbmNlTWF0cml4U2VydmljZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0RGlyZWN0aW9uKGRlc3RpbmF0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZTtcclxuICAgICAgICB0aGlzLmRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcih7XHJcbiAgICAgICAgICAgIG1hcDogdGhpcy5tYXBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZUFuZERpc3BsYXlSb3V0ZShkZXN0aW5hdGlvbiwgdGhpcy5kaXJlY3Rpb25zU2VydmljZSwgdGhpcy5kaXJlY3Rpb25zRGlzcGxheSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FsY3VsYXRlQW5kRGlzcGxheVJvdXRlKGRlc3RpbmF0aW9uLCBkaXJlY3Rpb25zU2VydmljZSwgZGlyZWN0aW9uc0Rpc3BsYXkpIHtcclxuICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZSh7XHJcbiAgICAgICAgICAgIG9yaWdpbjogdGhpcy5tYXJrZXIuZ2V0UG9zaXRpb24oKSxcclxuICAgICAgICAgICAgZGVzdGluYXRpb246IGRlc3RpbmF0aW9uIHx8ICdNYXNqaWQgTmVnZXJpLCBQZW5hbmcnLFxyXG4gICAgICAgICAgICB0cmF2ZWxNb2RlOiAnRFJJVklORycsXHJcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cykge1xyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnT0snKSB7XHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnRGlyZWN0aW9ucyByZXF1ZXN0IGZhaWxlZCBkdWUgdG8gJyArIHN0YXR1cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRNYXBPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgICAgICB0aGlzLm1hcC5zZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFkZHJlc3NGcm9tTGF0TG5nKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgLy8gXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nZW9jb2Rlci5nZW9jb2RlKHsnbG9jYXRpb24nOiBsb2NhdGlvbn0sIGZ1bmN0aW9uKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ09LJykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdObyByZXN1bHRzIGZvdW5kJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0dlb2NvZGVyIGZhaWxlZCBkdWUgdG86ICcgKyBzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRMYXRMbmdGcm9tQWRkcmVzcyhhZGRyZXNzKSB7XHJcbiAgICAgICAgLy8gXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nZW9jb2Rlci5nZW9jb2RlKHsnYWRkcmVzcyc6IGFkZHJlc3N9LCBmdW5jdGlvbihyZXN1bHRzLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdPSycpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXQ6IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubGF0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdObyByZXN1bHRzIGZvdW5kJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoJ0dlb2NvZGVyIGZhaWxlZCBkdWUgdG86ICcgKyBzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREaXN0YW5jZShmcm9tLCB0bykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdGFuY2VTZXJ2aWNlLmdldERpc3RhbmNlTWF0cml4KHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbnM6IFtmcm9tXSxcclxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uczogW3RvXSxcclxuICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6ICdEUklWSU5HJyxcclxuICAgICAgICAgICAgICAgIC8vIHVuaXRTeXN0ZW06IGdvb2dsZS5tYXBzLlVuaXRTeXN0ZW0uTUVUUklDLFxyXG4gICAgICAgICAgICAgICAgLy8gYXZvaWRIaWdod2F5czogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyBhdm9pZFRvbGxzOiBmYWxzZVxyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXN1bHRzLCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdPSycpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LnJvd3MuZWxlbWVudHMuZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCgnTm8gcmVzdWx0cyBmb3VuZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KCdHZW9jb2RlciBmYWlsZWQgZHVlIHRvOiAnICsgc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59IC8vIEVORCBjbGFzcyIsIlxyXG5pbXBvcnQgUmlkZXIgZnJvbSAnLi9tb2R1bGVzL1JpZGVyLmpzJztcclxuaW1wb3J0IERyaXZlciBmcm9tICcuL21vZHVsZXMvRHJpdmVyLmpzJztcclxuaW1wb3J0IEdNYXAgZnJvbSAnLi9tb2R1bGVzL0dNYXAuanMnO1xyXG5cclxubGV0IHVzZXJSb2xlID0gZ2xvYmFsVmFyLnVzZXJSb2xlIHx8ICdyaWRlcic7XHJcbmxldCBnTWFwO1xyXG5cclxuXHJcbi8vIHVzZWQgaW4gVXNlcjo6d2F0Y2hQb3NpdGlvbigpICYgOjp1cGRhdGVQb3NpdGlvbigpXHJcbndpbmRvdy5nbG9iYWxWYXIuYWNjZXNzT2ZMb2NhdGlvbiA9ICd1bmtub3duJztcclxud2luZG93Lmdsb2JhbFZhci5pc0dQU1R1cm5lZE9uID0gJ3Vua25vd24nO1xyXG5cclxuXHJcbi8vICNBUFAtTUVOVSAoI0FQUCAjTUVOVSlcclxuJCgnLmpzLWFwcE1lbnVUb2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHQkKCcjYXBwTWVudScpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XHJcbn0pO1xyXG5cclxuXHJcbmlmKHVzZXJSb2xlID09ICdkcml2ZXInKSB7XHJcblxyXG5cdHZhciBkcml2ZXIgPSBuZXcgRHJpdmVyKCk7XHJcblxyXG5cdC8vIEluaXRpYWxpemUgbWFwIGFmdGVyIGdldHRpbmcgdXNlcidzIHBvc2l0aW9uXHJcblx0ZHJpdmVyLndhdGNoUG9zaXRpb24oKS50aGVuKChwb3NpdGlvbk9iaik9PntcclxuXHRcdHdpbmRvdy5nTWFwID0gbmV3IEdNYXAoJ21hcENvbnRhaW5lcicsIGRyaXZlci5jb29yZHMpO1xyXG5cdH0pLmNhdGNoKChlcnJNc2cpPT57XHJcblx0XHR3aW5kb3cuZ01hcCA9IG5ldyBHTWFwKCdtYXBDb250YWluZXInKTtcclxuXHRcdC8vIFJlbWluZCB1c2VyIHRvIG9wZW4gR1BTIGxvY2F0aW9uICh0ZW1wIGR1biBuaWQgZG8gaGVyZSlcclxuXHR9KTtcclxuXHJcblx0d2luZG93LmRyaXZlckEgPSBkcml2ZXI7XHJcblxyXG5cdC8vICNPTkxJTkUgKEdPIE9OTElORSlcclxuXHQkKCcjb25saW5lQnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblxyXG5cdFx0bGV0IHN0YXR1cyA9ICQodGhpcykuZGF0YSgnc3RhdHVzJyk7XHJcblxyXG5cdFx0c3dpdGNoKHN0YXR1cykge1xyXG5cdFx0XHRjYXNlICdvZmZsaW5lJzpcclxuXHRcdFx0XHRkcml2ZXIub25saW5lKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdvbmxpbmUnOlxyXG5cdFx0XHRcdGRyaXZlci5vZmZsaW5lKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdwaWNraW5nVXAnOlxyXG5cdFx0XHRcdGRyaXZlci5waWNrZWRVcFJpZGVyKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdmZXRjaGluZ1JpZGVyJzpcclxuXHRcdFx0XHRkcml2ZXIuZHJvcHBlZE9mZlJpZGVyKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHN0YXR1cyk7XHJcblx0XHRcdFx0cmV0dXJuIHN0YXR1cztcclxuXHRcdH1cclxuXHRcdFxyXG5cdH0pO1xyXG5cclxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5sb2FkJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdGxldCBkYXRhID0gJyc7XHJcblx0XHRuYXZpZ2F0b3Iuc2VuZEJlYWNvbihgJHsod2luZG93Lmdsb2JhbFZhci5iYXNlVVJJIHx8IGRvY3VtZW50LmJhc2VVUkkpfWFwaS9kcml2ZXJHb09mZmxpbmVgLCBkYXRhKTtcclxuXHR9KTtcclxuXHJcbn0gZWxzZSB7XHJcblxyXG5cdHZhciByaWRlciA9IG5ldyBSaWRlcigpO1xyXG5cdFxyXG5cdC8vIEluaXRpYWxpemUgbWFwIGFmdGVyIGdldHRpbmcgdXNlcidzIHBvc2l0aW9uXHJcblx0cmlkZXIud2F0Y2hQb3NpdGlvbigpLnRoZW4oKHBvc2l0aW9uT2JqKT0+e1xyXG5cdFx0Ly8gY29uc29sZS5sb2cocG9zaXRpb25PYmopO1xyXG5cdFx0d2luZG93LmdNYXAgPSBuZXcgR01hcCgnbWFwQ29udGFpbmVyJywgcmlkZXIuY29vcmRzKTtcclxuXHR9KS5jYXRjaCgoZXJyTXNnKT0+e1xyXG5cdFx0Y29uc29sZS5sb2coZXJyTXNnKTtcclxuXHRcdHdpbmRvdy5nTWFwID0gbmV3IEdNYXAoJ21hcENvbnRhaW5lcicpO1xyXG5cdFx0Ly8gUmVtaW5kIHVzZXIgdG8gb3BlbiBHUFMgbG9jYXRpb24gKHRlbXAgZHVuIG5pZCBkbyBoZXJlKVxyXG5cdH0pO1xyXG5cclxuXHJcblxyXG5cdC8vICNPTkxJTkUgKEdFVCBBIFJJREUpXHJcblx0JCgnI3JlcXVlc3RCdG4nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHJcblx0XHRsZXQgc3RhdHVzID0gJCh0aGlzKS5kYXRhKCdzdGF0dXMnKTtcclxuXHJcblx0XHRzd2l0Y2goc3RhdHVzKSB7XHJcblx0XHRcdGNhc2UgJ29mZmxpbmUnOlxyXG5cdFx0XHRcdHJpZGVyLm9ubGluZSgpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSAnb25saW5lJzpcclxuXHRcdFx0XHRyaWRlci5vZmZsaW5lKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICd3YWl0aW5nRHJpdmVyJzpcclxuXHRcdFx0XHRyaWRlci5waWNrZWRVcEJ5RHJpdmVyKCk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdvblRoZVJvYWQnOlxyXG5cdFx0XHRcdHJpZGVyLnJlYWNoZWREZXN0aW5hdGlvbigpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG5cdFx0XHRcdHJldHVybiBzdGF0dXM7XHJcblx0XHR9XHJcblx0XHRcclxuXHR9KTtcclxuXHJcbn1cclxuIl0sIm5hbWVzIjpbIlVJLmN1c3RvbUFsZXJ0IiwiQVBJLnNldENvb3JkcyIsIlVJLnBvcFNob3J0TXNnIiwiVUkuc2hvd09ubGluZUluZGljYXRvciIsIlVJLmNoYW5nZVJlcXVlc3RCdG4iLCJVSS5oaWRlT25saW5lSW5kaWNhdG9yIiwiVUkuZW5hYmxlUmVxdWVzdEJ0biIsIkFQSS5uZWFyYnlEcml2ZXIiLCJVdGlsLmdldFJhbmRvbUludEluY2x1c2l2ZSIsIlVJLmRpc2FibGVSZXF1ZXN0QnRuIiwiQVBJLmRyaXZlckRldGFpbHMiLCJkcml2ZXJEZXRhaWxzIiwiVUkuY3VzdG9tQ29uZmlybSIsIkFQSS5hY2NlcHRSaWRlIiwiQVBJLmNoZWNrUmlkZVN0YXR1cyIsIlVJLmN1c3RvbURpYWxvZyIsIkFQSS5wbGFjZUJldCIsIkFQSS5jaGVja0JldFJlc3VsdCIsIkFQSS5nZXRGYXJlSW5mbyIsIkFQSS5yZWFjaGVkRGVzdGluYXRpb24iLCJBUEkub25saW5lIiwiVUkuY2hhbmdlT25saW5lQnRuIiwiVUkuZW5hYmxlT25saW5lQnRuIiwiQVBJLm9mZmxpbmUiLCJBUEkuY2hlY2tKb2IiLCJVSS5kaXNhYmxlT25saW5lQnRuIiwiQVBJLmFjY2VwdEpvYiIsIkFQSS5kZWNsaW5lSm9iIiwiQVBJLmRyaXZlckdldEJldFJlc3VsdCIsIkFQSS5nZXRSaWRlckluZm8iLCJVSS5jdXN0b21Qcm9tcHQiLCJBUEkuc2V0UmlkZXJEZXN0aW5hdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNPLFNBQVMsbUJBQW1CLEdBQUc7Q0FDckMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ3pDOztBQUVELEFBQU8sU0FBUyxtQkFBbUIsR0FBRztDQUNyQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDNUM7Ozs7QUFJRCxBQUFPLFNBQVMsV0FBVyxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsU0FBUyxHQUFHLElBQUksRUFBRTtDQUN2RCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7Q0FDM0IsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs7O0NBR3RDLElBQUksU0FBUyxFQUFFO0VBQ2QsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0VBQ3hCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0VBQzFCOzs7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
