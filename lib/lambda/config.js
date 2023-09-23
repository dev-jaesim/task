const BASE_URL = "https://portal.spatial.nsw.gov.au/server/rest/services";

const ENDPOINTS = {
    NSW_Geocoded_Addressing_Theme: "/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query",
    NSW_Administrative_Boundaries_Theme_Suburb: "/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query",
    NSW_Administrative_Boundaries_Theme_District: "/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query"
};

const QUERY_PARAMS = {
    Address: "?outFields=*&f=geojson&where=address='",
    Suburb: "?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry=",
    District: "?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry="
};

module.exports = {
    ADDRESS_POINT_URL: BASE_URL + ENDPOINTS.NSW_Geocoded_Addressing_Theme + QUERY_PARAMS.Address,
    SUBURB_URL: BASE_URL + ENDPOINTS.NSW_Administrative_Boundaries_Theme_Suburb + QUERY_PARAMS.Suburb,
    STATE_ELECTORAL_DISTRICT_URL: BASE_URL + ENDPOINTS.NSW_Administrative_Boundaries_Theme_District + QUERY_PARAMS.District
};

// test