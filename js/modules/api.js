
import ErrorHandler from './ErrorHandler';

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
export function login(reqData) {
	return ajax({
		url: `${apiURL}/login`,
		method: 'POST',
		data: reqData,
		dataType: 'json',
	});
}

export function getCoords(userID) {
	return ajax({
		url: `${apiURL}/getUserLastLocation/${userID}`,
		dataType: 'json',
	});
}

export function setCoords(lng, lat) {
	return ajax({
		url: `${apiURL}/setUserLastLocation/${lng}/${lat}`,
		dataType: 'json',
	});
}



/**
 * RIDER API
   ========================================*/

// return [{name, longitude, latitude, distance},{name,...}]
export function nearbyDriver() {
	return ajax({
		url: `${apiURL}/getNearbyDriver`,
		dataType: 'json',
	});
}

export function driverDetails(driverID) {
	return ajax({
		url: `${apiURL}/getDriverDetails/${driverID}`,
		dataType: 'json',
	});
}

export function acceptRide(driverID) {
	return ajax({
		url: `${apiURL}/acceptRide/${driverID}`,
		dataType: 'json',
	});
}


// Betting
export function checkBetResult(betID) {
	return ajax({
		url: `${apiURL}/getBetResult/${betID}`,
		dataType: 'json',
	});
}

export function placeBet(betID, amount) {
	return ajax({
		url: `${apiURL}/placeBet/${betID}/${amount}`,
		dataType: 'json',
	});
}

// Ride
export function checkRideStatus(driverID) {
	return ajax({
		url: `${apiURL}/getRideStatus/${driverID}`,
		dataType: 'json',
	});
}

export function getFareInfo() {
	return ajax({
		url: `${apiURL}/getFareInfo`,
		dataType: 'json',
	});
}

export function reachedDestination(fareID) {
	return ajax({
		url: `${apiURL}/dropOff/${fareID}`,
		dataType: 'json',
	});
}





/**
 * DRIVER API
   ========================================*/

// Availability
export function online() {
	return ajax({
		url: `${apiURL}/driverGoOnline`,
		dataType: 'json',
	});
}

export function offline() {
	return ajax({
		url: `${apiURL}/driverGoOffline`,
		dataType: 'json',
	});
}



// Jobs
export function checkJob() {
	return ajax({
		url: `${apiURL}/driverCheckJobs`,
		dataType: 'json',
	});
}

export function acceptJob() {
	return ajax({
		url: `${apiURL}/acceptJobs`,
		dataType: 'json',
	});
}

export function declineJob() {
	return ajax({
		url: `${apiURL}/rejectJobs`,
		dataType: 'json',
	});
}


// Betting
export function driverGetBetResult(betID) {
	return ajax({
		url: `${apiURL}/driverGetBetResult/${betID}`,
		dataType: 'json',
	});
}


// Ride
export function getRiderInfo(riderID) {
	return ajax({
		url: `${apiURL}/getRiderDetails/${riderID}`,
		dataType: 'json',
	});
}

export function setRiderDestination(riderID, lng, lat, betID = 0) {
	betID = betID ? betID : `/${betID}`;
	return ajax({
		url: `${apiURL}/setDestination/${riderID}/${lng}/${lat}${betID}`,
		dataType: 'json',
	});
}