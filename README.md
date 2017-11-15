



## Timestamp API Service
Node JS API service that returns a unix timestamp and a set of natural language properties of a date given  
a unix timestamp or natural language date as a parameter

### Usage
Possible endpoints
- *www.apiurl.com**/unixTimestamp** *
- *www.apiurl.com**/naturalLanguageDate** *  
  
Example
- *www.apiurl.com**/1388880000** *
- *www.apiurl.com**/1388000** *
- *www.apiurl.com**/January%2005%202014** *
- *www.apiurl.com**/2014%2005%20january** *

**%20** is url encoding for a space character

### Response
Response Object representing a specific date based on the input parameter
```
{
  unix: int representing unix timestamp of the date
  natural: {
    fullDate: {string} full natural date as "month day, year"
	month: {string} month name of the date
	day: {int} day of the month of the date
	year: {int} 4 digit year of the date
	weekday: {string} weekday of the date such as "Monday"
  }
}
```

#### NOTE
- If parameter is a natural language date, it can be in any order. **2014 January 05** and **5 2014 January** are both valid.
- If parameter is a natural language date, it must contain year month and day. Failure to provide anyone of these may result in the others being randomized in the response.  
Example, only providing a month and day may result in a response with a random year.
- **Invalid UNIX Timestamp or natural langauge date will result in response with all properties set to null.**

#### Examples of invalid parameters
- */1388880022randomtext*
- */Janderury*
- */January%2045%202015*











