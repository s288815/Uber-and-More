import User from './User';
import * as API from './api';
import * as UI from './ui';
import * as Util from './Utility';

export default class Driver extends User {
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

		API.online().then(()=>{
			console.log('Status : ONLINE');
			UI.popShortMsg('Waiting for request...');
			UI.showOnlineIndicator();
			UI.changeOnlineBtn('Go offline', 'online', 'c-btn--ghost c-btn--tertiary', 'c-btn--primary');
			_this.checkJob();
		}).catch((err)=>{
			UI.hideOnlineIndicator();
			UI.changeOnlineBtn('Go online', 'offline', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
			UI.enableOnlineBtn();
		});
	}

	offline() {
		clearInterval(this.intervalID);
		API.offline().then(()=>{
			console.log('Status : OFFLINE');
			UI.popShortMsg('You\'re now offline');
			UI.hideOnlineIndicator();
			UI.changeOnlineBtn('Go online', 'offline', 'c-btn--primary', 'c-btn--ghost c-btn--tertiary');
			UI.enableOnlineBtn();
		});
	}


	// Jobs
	checkJob() {
		let _this = this;

		this.intervalID = setInterval(()=>{
			API.checkJob().then((res)=>{

				let messages = [
					'Please wait while searching for ride',
					'Keep calm, drive safe!',
					'Are your car in optimum condition?',
					'Remember to check your fuel',
					'Thank you for your patience'
				];
				let i = Util.getRandomIntInclusive(0, messages.length - 1);
				UI.popShortMsg(messages[i]);

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
		
		UI.disableOnlineBtn();

		let dialogBox = UI.customDialog({
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
		API.acceptJob().then((res)=>{
			if(res.is_betting) {
				
				UI.customAlert('You are on demand! Please wait while rider is betting.');

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

		API.declineJob().then(()=>{
			_this.offline();
		});
	}


	// Betting
	checkBetResult(betID) {
		let _this = this;

		this.intervalID = setInterval(()=>{
			API.driverGetBetResult(betID).then((res)=>{
				
				let messages = [
					'Result is on it\'s way',
					'Keep calm, drive safe!',
					'Are you ready for pick up?',
					'Thank you for your patience'
				];
				let i = Util.getRandomIntInclusive(0, messages.length - 1);
				UI.popShortMsg(messages[i]);

				if(res.winner > 0) {
					clearInterval(_this.intervalID);
					_this.getRiderInfo(res.winner);
					UI.popShortMsg('Finalizing & preparing rider info');
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
		
		API.getRiderInfo(riderID).then((res)=>{
			let rider = res.rider;
			let coords = {
				lat: parseFloat(rider.latitude),
				lng: parseFloat(rider.longitute),
			}

			gMap.getAddressFromLatLng(coords).then((addr)=>{
				rider.locationAddress = addr;
				_this.promptRiderInfo(rider);

				UI.changeOnlineBtn('Picked up', 'pickingUp', '','c-btn--ghost');
				UI.enableOnlineBtn();

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

		UI.customDialog({
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
						UI.enableOnlineBtn();
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
		UI.customPrompt('Please enter rider\'s destination', (res)=>{
			if(res) {
				_this.setDestination(res);
			}
		})
	}

	setDestination(destination) {
		let _this = this;

		gMap.getLatLngFromAddress(destination).then((location)=>{
			_this.target = location;
			console.log('location: ',location);

			gMap.getDirection(_this.target);

			UI.changeOnlineBtn('Dropped off', 'fetchingRider', 'c-btn--ghost', '');
			UI.enableOnlineBtn();
			
		}).then(()=>{
			let riderID = _this.matchedRiderInfo.id;
			let {lat, lng} = _this.target;
			let betID = _this.betID;

			API.setRiderDestination(riderID, lng, lat, betID).then((res)=>{
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