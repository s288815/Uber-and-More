import * as API from './api.js';

export default class User {
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

                API.setCoords(_this.lng, _this.lat);
                
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

                API.setCoords(_this.lng, _this.lat);

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