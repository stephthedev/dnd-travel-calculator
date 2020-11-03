var config = require("config");

var TravelCalculator = (function () {
	/**
	* @param normalTerrainMiles [int] The total miles in normal terrain
	* @param difficultTerrainMiles [int] The total miles in difficult terrain
	* @param travelPace [string] The travel pace used (normal|slow|fast)
	* @return [map] An associative array that represents a time object:
	{ days: <int>, hours: <int>, minutes: <int>}
	*/
	var calculateTravelTimeByLand = function(normalTerrainMiles, difficultTerrainMiles, travelPace) {
		//0. Check the pace
		if (!(travelPace == 'fast' || travelPace == 'slow' || travelPace == 'normal')) {
			travelPace = "normal";
		}

		//1. Independently get the travel times for normal and diff terrains
		var normalResult = calculate(normalTerrainMiles, false, "land", travelPace);
		var difficultResult = calculate(difficultTerrainMiles, true, "land", travelPace);
		
		//2. Add the results together
		var mergedResult = {
			days : normalResult.days + difficultResult.days,
			hours : normalResult.hours + difficultResult.hours,
			minutes : normalResult.minutes + difficultResult.minutes
		};

		//3. Make human readable
		upConvertTime(mergedResult, "land", travelPace); 
		return mergedResult;
	};

	var calculateTravelTimeBySea = function(totalMiles, boatType) {
		//0. Check the boat type

		//1. Get the travel time
		var result = calculate(totalMiles, false, "sea", boatType);

		//2. Upconvert
		upConvertTime(result, "sea", boatType);
		return result;
	};

	/**
	* @param totalMiles [int] The total miles to travel
	* @param isDifficult [boolean] Whether the travel is over difficult terrain
	* @param travelType [String] Possible values: "land", "sea"
	* @para travelPace [string] Possible values: (fast|normal|slow|galley|keelboat|longship|rowboat|sailingShip|warship)
	*/
	var calculate = function(totalMiles, isDifficult, travelType, travelPace) {
		var configPrefix = "Client.5e." + travelType + "." + travelPace;
		var time = {
			days: 0,
			hours: 0,
			minutes: 0
		};

		if (!isInt(totalMiles) || totalMiles <= 0) {
			return time;
		}

		var milesPerDay = config.get(configPrefix + ".milesPerDay");
		if (isDifficult) {
			milesPerDay /= 2;
		}
		var maxHoursTraveledPerDay = config.get(configPrefix + ".hoursPerDay");
		var milesPerHour = milesPerDay / maxHoursTraveledPerDay;
		var minsPerMile = 60 / milesPerHour;
		var remainingMiles = totalMiles % milesPerDay; 

		//Get the total days the trip takes (rounded down)
		time.days = Math.floor(totalMiles / milesPerDay);
		//Get the remaining miles needed to complete the journey on the last day
		time.hours = Math.floor(remainingMiles / milesPerHour);
		time.minutes = (remainingMiles % milesPerHour) * minsPerMile;
		return time;
	};

	/**
	* Upconverts time from something like 
	* days: 1, hours: 7, minutes: 60
	* to
	* days: 2, hours: 0, minutes: 0
	*/ 
	var upConvertTime = function(time, travelType, travelPace) {
		//1. Upconvert minutes to hours by mod-ing the value by 60 since there are 60 minutes in an hour
		var modMinutes = time.minutes % 60;
		//Then, add the quotient back to the hours since that represents 
		//how many hours were made from the minutes
		time.hours += Math.floor(time.minutes / 60);
		time.minutes = modMinutes;

		//2. Upconvert hours to days by mod-ing the total hours by the hours traveled in a day
		var maxHoursTraveledPerDay = config.get("Client.5e." + travelType + "." + travelPace + ".hoursPerDay");
		var modHours = time.hours % maxHoursTraveledPerDay;
		//Then, add the quotient back to the days since that represents
		//how many days were made from the hours
		time.days += Math.floor(time.hours / maxHoursTraveledPerDay);
		time.hours = modHours;

		//3. The days should be a merged result of extra day made from hours/minutes
	};

	var isInt = function(value) {
  		return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
	};
  
	return {
  		calculateTravelTimeByLand : calculateTravelTimeByLand,
  		calculateTravelTimeBySea : calculateTravelTimeBySea
	};

})();

module.exports = TravelCalculator;