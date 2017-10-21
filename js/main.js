
import Rider from './modules/Rider.js';
import Driver from './modules/Driver.js';
import GMap from './modules/GMap.js';

let userRole = globalVar.userRole || 'rider';
let gMap;


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
