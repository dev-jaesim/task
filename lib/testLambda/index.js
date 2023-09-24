const axios = require('axios');
const testInput = require('./testInput');

// Initialise a test result object with given values or defaults.
function buildResult(testInput, test, testResult = 'Pass') {
    return {
        testResult,
        testInput,
        test
    };
}

function extractCoordinates(response) {
    let coordinates = [];
    const baseAddress = response.features[0].properties.address;
    let result = buildResult(response);

    for (let feature of response.features) {
        if (feature.properties.address !== baseAddress) {
            result.test = 'Multiple features with different addresses from NSW_Geocoded_Addressing_Theme.'
            result.testResult = 'Fail';
            return result;
        }
        
        if (!feature.geometry || !feature.geometry.coordinates) {
            result.test = 'Feature without coordinates from NSW_Geocoded_Addressing_Theme.'
            result.testResult = 'Fail';
            return result;
        }
        
        coordinates.push(feature.geometry.coordinates);
    }

    if (coordinates.length === 0) {
        result.test = 'No address found from NSW_Geocoded_Addressing_Theme.'
        result.testResult = 'Fail';
        return result;
    }

    return testResult;
}

async function callApi(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchInformation(coord, urlConfig, propName) {
    const url = `${urlConfig}${coord[0]},${coord[1]}`;
    const response = await callApi(url);

    return response.features[0].properties[propName];
}

// Populate the result object with error details.
function setResultError(result, testMessage, testResult, initialValue, currentValue, propName) {
    result.test = testMessage;
    result.testResult = testResult;
    
    if (propName === 'suburbname') {
        result.initialSuburb = initialValue;
        result.currentSuburb = currentValue;
    } else if (propName === 'districtname') {
        result.initialDistrict = initialValue;
        result.currentDistrict = currentValue;
    }
}

async function fetchAdministrativeBoundaries(coordinates, url, propName, errorMessage) {
    let result = buildResult(testInput.NSW_ADMINISTRATIVE_BOUNDARIES);
    const initialValue = await fetchInformation(coordinates[0], url, propName);

    const errorMessages = {
        'suburbname': 'Different suburbnames from the same addresses.',
        'districtname': 'Different districtnames from the same addresses.'
    };

    for (let i = 1; i < coordinates.length; i++) {
        const currentValue = await fetchInformation(coordinates[i], url, propName);
        if (currentValue !== initialValue) {
            setResultError(result, errorMessages[propName], errorMessage, initialValue, currentValue, propName);
        }
    }

    return result;
}

exports.handler = async (event) => {
    try {
        console.log(event);

        let testResult;
        const parameter = event.queryStringParameters;

        // Determine the appropriate test scenario based on the provided parameter:
        // - ADDRESSES_NOT_SAME: Check if multiple returned features from an address are consistent.
        // - MISSING_COORDINATES: Validate that every feature has coordinates.
        // - SUBURBS_NOT_SAME: Ensure all features from one address return the same suburb names, even if coordinates differ.
        // - DISTRICTS_NOT_SAME: Similarly, ensure consistency in state electoral district names across features.
        switch (parameter.test) {
            case 'ADDRESSES_NOT_SAME':
                testResult = extractCoordinates(testInput.ADDRESSES_NOT_SAME);
                break;
            case 'MISSING_COORDINATES':
                testResult = extractCoordinates(testInput.MISSING_COORDINATES);
                break;
            case 'SUBURBS_NOT_SAME':
                testResult = await fetchAdministrativeBoundaries(testInput.NSW_ADMINISTRATIVE_BOUNDARIES.coordinates, testInput.SUBURBS_NOT_SAME_TEST_URL, 'suburbname', 'Fail');
                break;
            case 'DISTRICTS_NOT_SAME':
                testResult = await fetchAdministrativeBoundaries(testInput.NSW_ADMINISTRATIVE_BOUNDARIES.coordinates, testInput.DISTRICTS_NOT_SAME_TEST_URL, 'districtname', 'Fail');
                break;
            default:
                testResult = buildResultObject(null, 'Invalid test parameter', 'Fail');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                result: testResult
            }),
        };        
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    code: 500,
                    message: error.message
                },
            }),
        };
    }
};