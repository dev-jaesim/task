# Interview Assessment Task

This repository includes the interview assessment task, which covers the creation of a Node.js AWS Lambda function for handling geocoding requests. It processes address queries to return relevant geospatial data and comes with test cases.

**Git Repository:** <https://github.com/dev-jaesim/task/tree/master>

## Table of Contents

- [Introduction](#introduction)
- [Technology Stack](#technology-stack)
- [Dependencies](#dependencies)
- [Error Messages](#error-messages)
- [CustomError Class](#customerror-class)
- [Functions](#functions)
    - [raiseError(errCode, errDesc)](#raiseerrorerrcode-errdesc)
    - [validateAddress(address)](#validateaddressaddress)
    - [callApi(url)](#callapiurl)
    - [fetchAddressData(address)](#fetchaddressdataaddress)
    - [extractCoordinates(response)](#extractcoordinatesresponse)
    - [fetchInformation(coord, urlConfig, propName)](#fetchinformationcoord-urlconfig-propname)
    - [fetchAdministrativeBoundaries(coordinates, url, propName, errorMessage)](#fetchadministrativeboundariescoordinates-url-propname-errormessage)
    - [handler(event)](#handlerevent)
- [Testing the Function](#testing-the-function)
    - [Test Cases with Real Data](#test-cases-with-real-data)
        - [Test Case 1: Valid Address](#test-case-1-valid-address)
        - [Test Case 2: Invalid Address](#test-case-2-invalid-address)
        - [Test Case 3: Special Character](#test-case-3-special-character)
        - [Test Case 4: No Query String](#test-case-4-no-query-string)
        - [Test Case 5: No Address Parameter](#test-case-5-no-address-parameter)
    - [Test Cases with Mock Data](#test-cases-with-mock-data)
        - [Test Case 1: ADDRESSES_NOT_SAME](#test-case-1-addressesnotsame)
        - [Test Case 2: MISSING_COORDINATES](#test-case-2-missingcoordinates)
        - [Test Case 3: SUBURBS_NOT_SAME](#test-case-3-suburbsnotsame)
        - [Test Case 4: DISTRICTS_NOT_SAME](#test-case-4-districtsnotsame)

## INTRODUCTION

This code is used to retrieve location information based on an input address. It validates the address, makes an HTTP call to retrieve location data, and then extracts the required information from the response. The code also handles errors and provides consistent error messaging.

## TECHNOLOGY STACK

This task has been built using:

- AWS CDK (TypeScript)
- Node.js

## DEPENDENCIES

The Node.js AWS Lambda function has the following dependencies:

- `axios` library for making HTTP requests
- `config` module that contains the URLs for the address point, suburb, and state electoral district

## ERROR MESSAGES

The code defines various error messages to be returned in case of specific errors. These error messages are stored in the `ERROR_MESSAGES` object.

- `BAD_REQUEST_ADDRESS`: Address parameter is required.
- `BAD_REQUEST_SPECIAL_CHARS`: Address cannot include any special characters.
- `NO_FEATURES_FOUND`: No address found in the response.
- `ADDRESSES_NOT_SAME`: Addresses in the features are not the same.
- `MISSING_COORDINATES`: Missing coordinates in the feature.
- `SUBURBS_NOT_SAME`: Suburbs in the features are not the same.
- `DISTRICTS_NOT_SAME`: State Electoral District in the features are not the same.
- `MISSING_QUERY`: Missing query string parameters.
- `UNEXPECTED_ERROR`: Unexpected error occurred. 

## CUSTOMERROR CLASS

The code defines a custom error class `CustomError` that extends the `Error` class. This class is used to throw consistent errors with an error code and description.

**Constructor** : Initialises the error code and description properties.

## FUNCTIONS

### raiseError(errCode, errDesc)

This function is used to raise an error with the specified error code and description. It throws an instance of the `CustomError` class.

- Parameters:
    - `errCode` (number): The error code.
    - `errDesc` (string): The error description.
- Throws:
    - `CustomError`: An instance of the `CustomError` class.

### validateAddress(address)

This function is used to validate the address parameter from users. It checks if the address is provided and if it contains any special characters. It returns the uppercase version of the address if it passes the validation.

- Parameters:
    - `address` (string): The address to validate.
- Returns:
    - The validated uppercase address.
- Throws:
    - `CustomError` with the error code 400 and description `ERROR_MESSAGES.BAD_REQUEST_ADDRESS` if the address parameter is missing.
    - `CustomError` with the error code 400 and description `ERROR_MESSAGES.BAD_REQUEST_SPECIAL_CHARS` if the address contains special characters.

### callApi(url)

This function is used to make an HTTP request using axios. It sends a GET request to the specified URL and returns the response data.

- Parameters:
    - `url` (string): The URL to make the HTTP request.
- Returns:
    - The response data.
- Throws:
    - `CustomError` with the error code 400 and description `ERROR_MESSAGES.NO_FEATURES_FOUND` if no features are found in the response.
    - `CustomError` with the error code from the response or 500 and description from the response or `ERROR_MESSAGES.UNEXPECTED_ERROR` if an unexpected error occurs.

### fetchAddressData(address)

This function is used to retrieve location information based on the input address. It calls the callApi function to make the HTTP request and returns the response data.

- Parameters:
    - `address` (string): The input address.
- Returns:
    - The response data from the HTTP request made to the address point URL.

### extractCoordinates(response)

This function is used to extract coordinates from the response. It iterates over the features in the response and checks if the addresses and coordinates are consistent. It returns an array of coordinates.

- Parameters:
    - `response` (object): The response object from the address point URL.
- Returns:
    - An array of coordinates.
- Throws:
    - `CustomError` with the error code 400 and description `ERROR_MESSAGES.ADDRESSES_NOT_SAME` if there are multiple features with different addresses.
    - `CustomError` with the error code 400 and description `ERROR_MESSAGES.MISSING_COORDINATES` if a feature does not have coordinates.

### fetchInformation(coord, urlConfig, propName)

This function is used to send HTTP calls to the specified URL and retrieve information from the response based on the coordinate. It calls the `callApi` function to make the HTTP request and returns the value of the specified property from the response.

- Parameters:
    - `coord` (array): The coordinate array [longitude, latitude].
    - `urlConfig` (string): The URL configuration for the specific administrative boundary.
    - `propName` (string): The property name to extract from the response.
- Returns:
    - The value of the specified property from the response.

### fetchAdministrativeBoundaries(coordinates, url, propName, errorMessage)

This function is used to extract suburb names and state electoral district names. It sends an HTTP call with each coordinate and compares the responses. If there are multiple responses, it returns an error.

- Parameters:
    - `coordinates` (array): The array of coordinates.
    - `url` (string): The URL to retrieve administrative boundaries.
    - `propName` (string): The property name to extract from the response.
    - `errorMessage` (string): The error message to display in case of different values in the responses.
- Returns:
    - The value of the specified property from the response.
- Throws:
    - `CustomError` with the error code 400 and the specified error message if there are different values in the responses.

### handler(event)

This is the main handler function that is exported for the Lambda function. It handles the Lambda event and retrieves the location information based on the input address. It calls various functions to validate the address, fetch address data, extract coordinates, fetch suburb names, and fetch state electoral district names. It returns the location information in the response body.

- Parameters:
    - `event` (object): The Lambda event object.
- Returns:
    - The response object containing the status code and location information in the body.
- Throws:
    - `CustomError` with the error code 400 and description `ERROR_MESSAGES.MISSING_QUERY` if there are no query string parameters in the event.
    - `CustomError` with the error code from the error object or 500 and description from the error object or `ERROR_MESSAGES.UNEXPECTED_ERROR` if any other error occurs.

## Testing the Function

### Test Cases with Real Data

**Test URL:** `https://pyzbp2xd76vpj5iscer4bagady0aqita.lambda-url.ap-southeast-2.on.aws/query?address=`

You can use the above URL to conduct tests with real address data.

**Example:** `https://pyzbp2xd76vpj5iscer4bagady0aqita.lambda-url.ap-southeast-2.on.aws/query?address=346 Panorama Avenue Bathurst`

The Lambda returns:
- Location (latitude and longitude)
- Suburb name
- State Electoral District name

`{"location":[[149.56705027261992,-33.42968429289573,0]],"suburbName":"BATHURST","stateElectoralDistrictName":"BATHURST"}`

#### Test Case 1: Valid Address
- **Test URL:** `https://pyzbp2xd76vpj5iscer4bagady0aqita.lambda-url.ap-southeast-2.on.aws/query?address=79 Albert Avenue Chatswood`
- **Expected Result:** Pass
- **Expected Return:** `{"location":[[151.17981755102406,-33.798662882572586,0]],"suburbName":"CHATSWOOD","stateElectoralDistrictName":"WILLOUGHBY"}`

#### Test Case 2: Invalid Address
- **Test URL:** `https://pyzbp2xd76vpj5iscer4bagady0aqita.lambda-url.ap-southeast-2.on.aws/query?address=4883 Albert Avenue Chatswood`
- **Expected Result:** Fail
- **Expected Return:** `{"error":{"code":400,"message":"No address found in the response."}}`

#### Test Case 3: Special Character
- **Test URL:** `https://pyzbp2xd76vpj5iscer4bagady0aqita.lambda-url.ap-southeast-2.on.aws/query?address=4883! Albert Avenue Chatswood*`
- **Expected Result:** Fail
- **Expected Return:** `{"error":{"code":400,"message":"Bad Request: Address cannot include any special characters."}}`

#### Test Case 4: No Query String
- **Test URL:** `https://pyzbp2xd76vpj5iscer4bagady0aqita.lambda-url.ap-southeast-2.on.aws`
- **Expected Result:** Fail
- **Expected Return:** `{"error":{"code":400,"message":"Bad Request: Missing query string parameters."}}`

#### Test Case 5: No Address Parameter
- **Test URL:** `https://pyzbp2xd76vpj5iscer4bagady0aqita.lambda-url.ap-southeast-2.on.aws/query?name=jae`
- **Expected Result:** Fail
- **Expected Return:** `{"error":{"code":400,"message":"Bad Request: Address parameter is required."}}`

### Test Cases with Mock Data

I've observed that certain addresses can return multiple features. In such instances, all returned features should have identical values for 'address', 'suburb name', and 'state electoral district name', even though the coordinates for each feature might differ.

**Example:** `https://portal.spatial.nsw.gov.au/server/rest/services/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query?where=address='101 WATERLOO ROAD MACQUARIE PARK'&outFields=*&f=geojson`

`{"type":"FeatureCollection","features":[{"type":"Feature","id":4569873,"geometry":{"type":"Point","coordinates":[151.12090573824742,-33.77932832204111,0]},"properties":{"rid":4569873,"createdate":1573860049000,"gurasid":83427880,"principaladdresssiteoid":4306461,"addressstringoid":8121954,"addresspointtype":1,"addresspointuncertainty":null,"containment":1,"startdate":1573860608000,"enddate":32503680000000,"lastupdate":1573861007227,"msoid":8049299,"centroidid":null,"shapeuuid":"9a914b51-1016-3d34-926b-b1ca3c878c50","changetype":"I","processstate":null,"urbanity":"U","address":"101 WATERLOO ROAD MACQUARIE PARK","housenumber":"101"}},{"type":"Feature","id":4823859,"geometry":{"type":"Point","coordinates":[151.12150895157086,-33.778748854767429,0]},"properties":{"rid":4823859,"createdate":1606237597000,"gurasid":83438399,"principaladdresssiteoid":4308906,"addressstringoid":8125801,"addresspointtype":1,"addresspointuncertainty":null,"containment":1,"startdate":1606238060000,"enddate":32503680000000,"lastupdate":1606238180173,"msoid":8053578,"centroidid":null,"shapeuuid":"a5eb1db9-2ab9-3478-a174-211e5dfae1d5","changetype":"M","processstate":null,"urbanity":"U","address":"101 WATERLOO ROAD MACQUARIE PARK","housenumber":"101"}}]}`

I haven't been able to find an address that returns multiple features with different 'suburb names' or 'state electoral district names'. Therefore, I have created several test cases using mock data. The test Lambda function evaluates this mock data using the exact same functions present in the main Lambda function.

You can view the mock data at this URL: `https://github.com/dev-jaesim/task/blob/master/lib/testLambda/testInput.js`

**Test URL:** `https://kyx5gbc4r4grcvorvwxfdtjpje0eqqay.lambda-url.ap-southeast-2.on.aws/query?test=`

- **ADDRESSES_NOT_SAME:** Multiple features returned have differing property addresses.
- **MISSING_COORDINATES:** A feature is returned without coordinates.
- **SUBURBS_NOT_SAME:** Multiple features with different coordinates have varying suburb names. If they have different coordinates but the same suburb names, no error is returned for the suburb name.
- **DISTRICTS_NOT_SAME:** Multiple features with different coordinates have varying state electoral district names. If they have different coordinates but the same district names, no error is returned for the district name.

#### Test Case 1: ADDRESSES_NOT_SAME
- **Test URL:** `https://kyx5gbc4r4grcvorvwxfdtjpje0eqqay.lambda-url.ap-southeast-2.on.aws/query?test=ADDRESSES_NOT_SAME`
- **Expected Result:** Fail
- **Expected Return:** `{"result":{"testResult":"Fail","testInput":{"features":[{"geometry":{"type":"Point","coordinates":[151.120905738247,-33.7793283220411,0]},"properties":{"address":"101 WATERLOO ROAD MACQUARIE PARK"}},{"geometry":{"type":"Point","coordinates":[151.121508951571,-33.7787488547674,0]},"properties":{"address":"101 WATERLOO STREET MACQUARIE PARK"}}]},"test":"Multiple features from NSW_Geocoded_Addressing_Theme have different addresses."}}`

#### Test Case 2: MISSING_COORDINATES
- **Test URL:** `https://kyx5gbc4r4grcvorvwxfdtjpje0eqqay.lambda-url.ap-southeast-2.on.aws/query?test=MISSING_COORDINATES`
- **Expected Result:** Fail
- **Expected Return:** `{"result":{"testResult":"Fail","testInput":{"features":[{"geometry":{"type":"Point"},"properties":{"address":"101 WATERLOO ROAD MACQUARIE PARK"}}]},"test":"A feature from NSW_Geocoded_Addressing_Theme is missing coordinates."}}`

#### Test Case 3: SUBURBS_NOT_SAME
- **Test URL:** `https://kyx5gbc4r4grcvorvwxfdtjpje0eqqay.lambda-url.ap-southeast-2.on.aws/query?test=SUBURBS_NOT_SAME`
- **Expected Result:** Fail
- **Expected Return:** `{"result":{"testResult":"Fail","testInput":{"features":[{"geometry":{"type":"Point","coordinates":[151.120905738247,-33.7793283220411,0]},"properties":{"address":"101 WATERLOO ROAD MACQUARIE PARK"}},{"geometry":{"type":"Point","coordinates":[151.179817551024,-33.7986628825726,0]},"properties":{"address":"101 WATERLOO ROAD MACQUARIE PARK"}}],"coordinates":[[151.120905738247,-33.7793283220411,0],[151.179817551024,-33.7986628825726,0]]},"test":"Different suburb names for the same address.","initialSuburb":"MACQUARIE PARK","currentSuburb":"CHATSWOOD"}}`

#### Test Case 4: DISTRICTS_NOT_SAME
- **Test URL:** `https://kyx5gbc4r4grcvorvwxfdtjpje0eqqay.lambda-url.ap-southeast-2.on.aws/query?test=DISTRICTS_NOT_SAME`
- **Expected Result:** Fail
- **Expected Return:** `{"result":{"testResult":"Fail","testInput":{"features":[{"geometry":{"type":"Point","coordinates":[151.120905738247,-33.7793283220411,0]},"properties":{"address":"101 WATERLOO ROAD MACQUARIE PARK"}},{"geometry":{"type":"Point","coordinates":[151.179817551024,-33.7986628825726,0]},"properties":{"address":"101 WATERLOO ROAD MACQUARIE PARK"}}],"coordinates":[[151.120905738247,-33.7793283220411,0],[151.179817551024,-33.7986628825726,0]]},"test":"Different district names for the same address.","initialDistrict":"RYDE","currentDistrict":"WILLOUGHBY"}}`