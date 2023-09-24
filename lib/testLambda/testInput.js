const BASE_URL = "https://portal.spatial.nsw.gov.au/server/rest/services";

const ENDPOINTS = {
    NSW_Administrative_Boundaries_Theme_Suburb: "/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query",
    NSW_Administrative_Boundaries_Theme_District: "/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query"
};

const QUERY_PARAMS = {
    suburb: "?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry=",
    district: "?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry="
};

module.exports = {
    ADDRESSES_NOT_SAME: {
        "features": [
            {
                "geometry": {
                    "type": "Point",
                    "coordinates": [151.120905738247, -33.7793283220411, 0]
                },
                "properties": {
                    "address": "101 WATERLOO ROAD MACQUARIE PARK"
                }
            },
            {
                "geometry": {
                    "type": "Point",
                    "coordinates": [151.121508951571, -33.7787488547674, 0]
                },
                "properties": {
                    "address": "101 WATERLOO STREET MACQUARIE PARK"
                }
            }
        ]
    },
    MISSING_COORDINATES: {
        "features": [
            {
                "geometry": {
                    "type": "Point"
                },
                "properties": {
                    "address": "101 WATERLOO ROAD MACQUARIE PARK"
                }
            }
        ]
    },
    NSW_ADMINISTRATIVE_BOUNDARIES: {
        "features": [
            {
                "geometry": {
                    "type": "Point",
                    "coordinates": [151.120905738247, -33.7793283220411, 0]
                },
                "properties": {
                    "address": "101 WATERLOO ROAD MACQUARIE PARK"
                }
            },
            {
                "geometry": {
                    "type": "Point",
                    "coordinates": [151.179817551024, -33.7986628825726, 0]
                },
                "properties": {
                    "address": "101 WATERLOO ROAD MACQUARIE PARK"
                }
            }
        ],
        "coordinates": [
            [151.120905738247, -33.7793283220411, 0],
            [151.179817551024, -33.7986628825726, 0]
        ]
    },
    SUBURBS_NOT_SAME_TEST_URL: BASE_URL + ENDPOINTS.NSW_Administrative_Boundaries_Theme_Suburb + QUERY_PARAMS.suburb,
    DISTRICTS_NOT_SAME_TEST_URL: BASE_URL + ENDPOINTS.NSW_Administrative_Boundaries_Theme_District + QUERY_PARAMS.district
};