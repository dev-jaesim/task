const axios = require('axios');
const config = require('./config');

const ADDRESS_VALIDATION_REGEX = /^[a-zA-Z0-9\s]*$/;
const ERROR_MESSAGES = {
    BAD_REQUEST_ADDRESS: 'Bad Request: Address parameter is required.',
    BAD_REQUEST_SPECIAL_CHARS: 'Bad Request: Address cannot include any special characters.',
    NO_FEATURES_FOUND: 'No features found in the response.',
    ADDRESSES_NOT_SAME: 'Addresses in the features are not the same.',
    MISSING_COORDINATES: 'Missing coordinates in the feature.',
    SUBURBS_NOT_SAME: 'Suburbs in the features are not the same.',
    DISTRICTS_NOT_SAME: 'State Electoral District in the features are not the same.',
    MISSING_QUERY: 'Bad Request: Missing query string parameters.',
    UNEXPECTED_ERROR: 'Unexpected error occurred.',
};

class CustomError extends Error {
    constructor(errCode, errDesc) {
        super(errDesc);
        this.errCode = errCode;
        this.errDesc = errDesc;
    }
}

function raiseError(errCode, errDesc) {
    throw new CustomError(errCode, errDesc);
}

function validateAddress(address) {
    if (!address) raiseError(400, ERROR_MESSAGES.BAD_REQUEST_ADDRESS);
    if (!ADDRESS_VALIDATION_REGEX.test(address)) raiseError(400, ERROR_MESSAGES.BAD_REQUEST_SPECIAL_CHARS);
    
    return address.toUpperCase();
}

async function callApi(url) {
    try {
        const response = await axios.get(url);
    
        if (!response.data.features || response.data.features.length === 0) {
            raiseError(400, ERROR_MESSAGES.NO_FEATURES_FOUND);
        }

        return response.data;
    } catch (error) {
        const errCode = error.errCode || (error.response ? error.response.status : 500);
        const errDesc = error.errDesc || (error.response ? error.response.statusText : ERROR_MESSAGES.UNEXPECTED_ERROR);

        raiseError(errCode, errDesc);
    }
}

async function fetchAddressData(address) {
    const url = `${config.ADDRESS_POINT_URL}${encodeURIComponent(address)}'`;
    return callApi(url);
}

function extractCoordinates(response) {
    let coordinates = [];
    const baseAddress = response.features[0].properties.address;

    for (let feature of response.features) {
        if (feature.properties.address !== baseAddress) {
            raiseError(400, ERROR_MESSAGES.ADDRESSES_NOT_SAME);
        }
        
        if (!feature.geometry || !feature.geometry.coordinates) {
            raiseError(400, ERROR_MESSAGES.MISSING_COORDINATES);
        }
        
        coordinates.push(feature.geometry.coordinates);
    }

    if (coordinates.length === 0) {
        raiseError(400, ERROR_MESSAGES.NO_FEATURES_FOUND);
    }

    return coordinates;
}

async function fetchInformation(coord, urlConfig, propName) {
    const url = `${urlConfig}${coord[0]},${coord[1]}`;
    const response = await callApi(url);

    return response.features[0].properties[propName];
}

async function fetchAdministrativeBoundaries(coordinates, url, propName, errorMessage) {
    const initialValue = await fetchInformation(coordinates[0], url, propName);

    for (let i = 1; i < coordinates.length; i++) {
        const currentValue = await fetchInformation(coordinates[i], url, propName);
        if (currentValue !== initialValue) {
            raiseError(400, errorMessage, errorMessage);
        }
    }

    return initialValue;
}

exports.handler = async (event) => {
    try {
        if (!event.queryStringParameters) {
            raiseError(400, ERROR_MESSAGES.MISSING_QUERY);
        }

        console.log('event: ', event);

        const address = validateAddress(event.queryStringParameters.address);
        const nswGeocodeAddressingThemeResponse = await fetchAddressData(address);
        const coordinates = extractCoordinates(nswGeocodeAddressingThemeResponse);
        const suburb = await fetchAdministrativeBoundaries(coordinates, config.SUBURB_URL, 'suburbname', ERROR_MESSAGES.SUBURBS_NOT_SAME);
        const stateElectoralDistrict = await fetchAdministrativeBoundaries(coordinates, config.STATE_ELECTORAL_DISTRICT_URL, 'districtname', ERROR_MESSAGES.DISTRICTS_NOT_SAME);

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message: "Hello from Lambda!",
                querystring: event.queryStringParameters,
                response: nswGeocodeAddressingThemeResponse,
                coordinates: coordinates,
                suburb: suburb,
                stateElectoralDistrict: stateElectoralDistrict
            }),
        };        
    } catch (error) {
        const errCode = error.errCode || 500;
        const errDesc = error.errDesc || ERROR_MESSAGES.UNEXPECTED_ERROR;

        return {
            statusCode: errCode,
            body: JSON.stringify({
                error: {
                    code: errCode,
                    message: errDesc,
                },
            }),
        };
    }
};