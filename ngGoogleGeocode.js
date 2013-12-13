'use strict';

/**
 * angular service that supports google maps based geocoding
 * requires the ngResource Lib to be loaded
 * returns the results in {lat: '', lng: ''} object
 */

angular.module('googleGeocode', ['ngResource'])
		.service('googleGeocode', function($resource, $q){

			this.googleUrl = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true';

			/**
			 * Gets the latitude and longitude for a zipcode
			 * @param zipCode
			 * @returns {Function} promise
			 */
			this.byZipCode = function(zipCode){

				var coords = $q.defer();

				var geoCode = $resource(this.googleUrl + '&address=:zipCode', { zipCode: '@zipCode' });

				var location = geoCode.get({ zipCode: zipCode }, function () {
					coords.resolve(location.results[0].geometry.location);
				});

				return coords.promise;

			}

			/**
			 * Gets the current location from the browser and returns the latitude and longitude
			 * @returns {Function} promise
			 */
			this.byCurrentPosition = function(){

				var returnVal = $q.defer();

				navigator.geolocation.getCurrentPosition(function(position) {
					returnVal.resolve({lat:position.coords.latitude, lng:position.coords.longitude});
				});

				return returnVal.promise;
			}

			/**
			 * Helper method for the reverse geocoding a zipcode ( ei zip code -> latitude & longitude )
			 * @param coords
			 * @returns {Function} promise
			 */
			this.reverseGetZipCode = function(coords){
				return this.reverseGeocode('zipCode', coords.lat, coords.lng);
			}

			/**
			 * @todo actually write the logic in the called method
			 * @param coords
			 * @returns {*}
			 */
			this.reverseGetStreetAddress = function(coords){
				return this.reverseGeocode('streetAddress', coords.lat, coords.lng )
			}

			/**
			 * Supports reverse geocoding by type of return
			 * @param type
			 * @param lat
			 * @param lng
			 * @returns {Function}
			 */
			this.reverseGeocode = function(type, lat, lng){

				var result = $q.defer();

				var resource = $resource( this.googleUrl + '&latlng=:lat,:lng', { lat: '@lat', lng: '@lng' });

				var addressComponents = resource.get({lat: lat, lng: lng }, function(){

					if ( addressComponents.status != 'OK' ){
						result.resolve('Unknown Error Occured');
					}

					switch ( type ){
						case 'zipCode':
							angular.forEach(addressComponents.results[0].address_components, function(value, key){
								if ( value.types.indexOf('postal_code') > -1 ){
									result.resolve(value.short_name * 1);
								}
							});
							break;
						default:
							result.resolve(addressComponents.results[0].address_components);
							break;
					}

				});

				return result.promise;
			}

		});