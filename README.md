ngGoogleGeocode
===============

Basic Angular JS service that allows you to use the google maps api to geocde zip codes and it does some reverse geocoding

**Important**
This service requirse the angular-resource library to function at all. Please make sure you include that library in your script....

This service provides a simple ability to geocode by Zip Code and then to reverse geocode from a zip code.  I'm hoping to expand on it later.

The results are returned as an object { lat: _______, lng: _________ }

It returns and angular promise, so when you call it in the controller, you will have to handle the returned values via the .then function example below


```Javascript
function testController($scope, googleGeocode){

		var zipCode = '27612';
		var coordinates;

		var results = googleGeocode.byZipCode(zipCode);

		results.then(function(data){
			 coordinates = data;
		});

}


```