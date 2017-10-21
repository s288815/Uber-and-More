import User from './User';
import * as API from './api.js';
import * as UI from './ui';
import * as Util from './Utility';

export default class Rider extends User {
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
		UI.popShortMsg('Searching for nearby UBER...');
		UI.showOnlineIndicator();
		UI.changeRequestBtn('Maybe next time', 'online', 'c-btn--ghost c-btn--tertiary', 'c-btn--primary');
		this.checkRequestStatus();
	}

	offline() {
		// Get a ride
		clearInterval(this.intervalID);
		console.log('Status : OFFLINE');
		UI.popShortMsg('You\'re now offline');
		UI.hideOnlineIndicator();
		UI.changeRequestBtn('Go a ride', 'offline', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
		UI.enableRequestBtn();
	}

	checkRequestStatus() {
		UI.enableRequestBtn();
		this.clearLastDriverInfo();
		this.clearFareInfo();

		let _this = this;

		this.intervalID = setInterval(()=>{
			_this.nearbyDriver();
		}, this.delayTime);
	}

	nearbyDriver() {
		let _this = this;

		API.nearbyDriver().then((res)=>{
			console.log(res);
			let drivers = res || [];

			let messages = [
				'Result is on it\'s way',
				'Keep calm, ride safe!',
				'Finding you the best match',
				'Thank you for your patience'
			];
			let i = Util.getRandomIntInclusive(0, messages.length - 1);
			UI.popShortMsg(messages[i]);

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
		UI.disableRequestBtn();
		UI.popShortMsg('Finalizing & preparing driver info');

		let driverID = driverIDs[0].id;

		if(driverIDs.length > 1){
			let i = Util.getRandomIntInclusive(0, driverIDs.length - 1);
			driverID = driverIDs[i].id;
		}

		this.getDriverDetails(driverID);
	}

	getDriverDetails(id) {
		let _this = this;

		API.driverDetails(id).then((res)=>{
			_this.promptRide(res);
		}).catch((err)=>{
			console.log('Catched error: ', err);
		});
	}

	promptRide(driverDetails) {
		let _this = this;
		// let profilePic = driverDetails.profilePic || '<i class="fa fa-2x fa-user"></i>';
		let profilePic = '<img src="http://i.pravatar.cc/96" style="border-radius: 50%;" />' || '<i class="fa fa-2x fa-user"></i>';
		let {id: driverID, name, rating, car_plate: carNumPlate, phone: contactNum} = driverDetails;

		function capitalize(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		let carModel = `${capitalize(driverDetails.car_color)} ${capitalize(driverDetails.car_brand)} ${capitalize(driverDetails.car_model)}`

		let promptBox = UI.customConfirm({
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
					_this.matchedDriverInfo = driverDetails;
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
		
		API.acceptRide(driverID).then(()=>{
			_this.waitForResponceOfDriver();
		});
	}

	declineRide(driverID) {
		this.checkRequestStatus();
	}


	waitForResponceOfDriver() {
		let _this = this;

		this.intervalID = setInterval(()=>{

			API.checkRideStatus(_this.matchedDriverID).then((res)=>{
				
				let messages = [
					'Waiting for driver\'s responce',
					'Still waiting...',
					'Keep calm, stay safe!',
					'Please hold on while driver reply',
					'Thank you for your patience'
				];
				let i = Util.getRandomIntInclusive(0, messages.length - 1);
				UI.popShortMsg(messages[i]);

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

		UI.customAlert({
			title: 'Ride aborted',
			message: '<p>Driver may have declined or failed to accept ride request in time.</p>',
			buttons: {
				ok: {
					label: 'Got it',
					className: 'btn-info'
				}
			},
			callback: _this.offline
		})
	}

	promptToBet(betID) {
		let _this = this;

		UI.customDialog({
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

		API.placeBet(betID, amount).then((res)=>{
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
		UI.popShortMsg('Searching for other Uber driver');
		this.checkRequestStatus();
	}

	checkBetResult(betID) {
		let _this = this;

		this.betID = betID;

		this.intervalID = setInterval(()=>{

			API.checkBetResult(betID).then((res)=>{
				
				let messages = [
					'Waiting for other user...',
					'Still waiting...',
					'Keep calm, stay safe!',
					'Please hold on while others are betting',
					'Thank you for your patience',
				];
				let i = Util.getRandomIntInclusive(0, messages.length - 1);
				UI.popShortMsg(messages[i]);

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

		UI.customDialog({
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
		})
	}

	loseBet() {
		let _this = this;

		UI.customDialog({
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
		})
	}

	waitForArrivalOfDriver() {

		UI.changeRequestBtn('Picked up', 'waitingDriver', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
		UI.enableRequestBtn();

		this.intervalID = setInterval(()=>{
			let messages = [
				'You may see your Uber is on it\'s way',
				'Still waiting...',
				'Keep calm, stay safe!',
				'Again, thanks for your patience',
				'Driver on the way',
			];

			let i = Util.getRandomIntInclusive(0, messages.length - 1);
			
			UI.popShortMsg(messages[i]);

		}, this.duration.waitingArrivalOfDriver);
	}

	pickedUpByDriver() {
		UI.changeRequestBtn('Safely arrived', 'onTheRoad', 'c-btn--ghost c-btn--tertiary', 'c-btn--primary');
	}

	reachedDestination() {
		let _this = this;
		API.getFareInfo().then((fareInfo)=>{

			let fareID = fareInfo.id;
			let price = parseFloat(fareInfo.price);
			let betAmount = parseFloat(fareInfo.bet_amount);

			UI.customDialog({
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
							API.reachedDestination(fareID);
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