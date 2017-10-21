import theme from '../theme.json';

export default class GMap {
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
        }
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
                        }
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