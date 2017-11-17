/**
* API Response Object representing a date in time.
* @typedef {object} APIResponse
* @property {int|string} unixTimestamp - UNIX timestamp of the date
* @property {object} natural - Object containing natural language properties of the date
*
* @property {string} natural.fullDate - full combined natural representation of the date such as "January 15 2017"
* @property {string} month - name of the dates' month (example "March")
* @property {int|string} day - intiger day of the month (example 1, 30, 31)
* @property {int|string} year
* @property {string} weekday - Day of the week as a string (example "Monday")
*/


const http = require('http');
const url = require('url');

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
];
const weekdayNames = [
	'Sunday',
	'Monday',
	'Wednesday',
	'Thursday',
	'Firday',
	'Saturday'
];
function SecondsToMiliSeconds(seconds)
{
	return Math.floor(seconds * 1000);
}

function MilisecondsToSeconds(miliseconds)
{
	return Math.floor(miliseconds/1000);
}



const serverPort = process.env.PORT || 80;
const server = http.createServer(OnServerRequest);
server.listen(serverPort, OnServerStarted);


function OnServerStarted()
{
	console.log('Server Started on port ' + serverPort);
}


/**
* @function
* @callback
* Callback when a request is sent to the server.
*
* Expects a request with a single, unnamed ur paramter that is a unix timestamp or a full
* natural language date (example "March 3 2017" (in any order) )
*/
function OnServerRequest(request, response)
{
	let urlPath = url.parse(request.url).pathname;
	let decodedUri;
	try {
		decodedUri = decodeURI(urlPath);
		if(decodedUri.length <= 1)
		{
			decodedUri = null;
		}
		else if(decodedUri[0] === '/')
		{
			// remove initial forward slash usualy present
			decodedUri = decodedUri.slice(1);
		}
	}
	catch(error){
		decodedUri = null;
	}

	let responseString = BuildResponse(decodedUri);

	response.writeHead(200, {'Content-Type': 'application/json'} );
	response.end(responseString, 'utf-8', function(){} );
}



/**
* @function
* Returns response to send to the client.
* An invalid inputDate will result in a response object with all its properties set to null.
*
* @param {int|string} UNIX timestamp or full natural language date (example "January 1 2013")
* @returns {string} - String representation of APIResponse object {APIResponse}
*/
function BuildResponse(inputDate)
{
	// isNaN will return false for these values
	if(inputDate == '' || inputDate == null)
	{
		return BuildResponseObject(true);
	}

	let inputIsNumber = !isNaN(inputDate);
	if(inputIsNumber == true)
	{
		// js date object operates in miliseconds
		inputDate = SecondsToMiliSeconds( Number(inputDate) );
	}

	let dateObject = new Date(inputDate);
	let dateIsInvalid = isNaN(dateObject.getTime() );
	if(dateIsInvalid == true)
	{
		return BuildResponse(true);
	}

	let unixTimestamp = MilisecondsToSeconds(dateObject.getTime() );

	const month = monthNames[dateObject.getUTCMonth()];
	const day = dateObject.getUTCDate();
	const year = dateObject.getUTCFullYear();
	const weekday = weekdayNames[dateObject.getUTCDay()];

	const naturalDateString = `${month} ${day}, ${year}`;

	return BuildResponseObject(true, unixTimestamp, naturalDateString, month, day, year, weekday);


}


/**
* @function
* Builds returns the server response object as an object or string.
* Failure to supply any of the parameters will result in that parameter beaing defaulted
* to null.
*
* @param {bool} asString - If true, returns the response object as a string
* @param {int|string} unixTimestamp
* @param {string} dateString - full combined date such as "January 15 2017"
* @param {string} dateMonth - name of the month (example "March")
* @param {int|string} dateDay - intiger day of the month (example 1, 30, 31)
* @param {int|string} dateYear
* @param {string} dateWeekday - Day of the week as a string (example "Monday")
*
* @returns {APIResponse}
*/
function BuildResponseObject(asString, unixTimestamp=null, dateString=null, dateMonth=null, dateDay=null, dateYear=null, dateWeekday=null )
{
	let response = { unix: unixTimestamp, natural:{fullDate:dateString, month:dateMonth, day:dateDay, year:dateYear, weekday:dateWeekday } };

	if(asString == true)
	{
		return JSON.stringify(response);
	}
	return response;
}







