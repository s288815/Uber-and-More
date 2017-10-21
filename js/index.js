// import User from './modules/User.js';

window.globalVar = {
	name: 'Test01',
	contact: '+60123456789',
	userRole: sessionStorage.currentUserRole,
}

let {userRole} = globalVar;
let gMap;

if(userRole == 'driver') {
	var driver = new Driver();

	// Initialize map after getting user's position
	driver.watchPosition().then((positionObj)=>{
		// console.log(positionObj);
		gMap = new GMap('mapContainer', driver.coords);
	}).catch((errMsg)=>{
		console.log(errMsg);
		gMap = new GMap('mapContainer');
		// Remind user to open GPS location
	});

} else {
	var rider = new Rider();
	
	// Initialize map after getting user's position
	rider.watchPosition().then((positionObj)=>{
		// console.log(positionObj);
		gMap = new GMap('mapContainer', rider.coords);
	}).catch((errMsg)=>{
		console.log(errMsg);
		gMap = new GMap('mapContainer');
		// Remind user to open GPS location
	});

}





$('#onlineBtn').on('click', function(){
    driver.online();
    gMap.getDirection();
});



$('#requestBtn').on('click', function(){
    rider.online();
    $('.short-msg').toggleClass('hide');
    // gMap.getDirection();
});


$('#menuToggle').on('click', function(){
    $('.app-menu').toggleClass('open');
});


$('#nightMode').on('change', function(){
	let mode = ($(this).is(':checked'))? 'night' : '';

    let opt = {
    	styles: theme[mode],
    };

    gMap.setMapOptions(opt);
});