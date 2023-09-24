const BASE_URL = "https://portal.spatial.nsw.gov.au/server/rest/services";

const ENDPOINTS = {
    NSW_Geocoded_Addressing_Theme: "/NSW_Geocoded_Addressing_Theme/FeatureServer/1/query",
    NSW_Administrative_Boundaries_Theme_Suburb: "/NSW_Administrative_Boundaries_Theme/FeatureServer/2/query",
    NSW_Administrative_Boundaries_Theme_District: "/NSW_Administrative_Boundaries_Theme/FeatureServer/4/query"
};

const QUERY_PARAMS = {
    address: "?outFields=*&f=geojson&where=address='",
    suburb: "?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry=",
    district: "?geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=geoJSON&geometry="
};

module.exports = {
    ADDRESS_POINT_URL: BASE_URL + ENDPOINTS.NSW_Geocoded_Addressing_Theme + QUERY_PARAMS.address,
    SUBURB_URL: BASE_URL + ENDPOINTS.NSW_Administrative_Boundaries_Theme_Suburb + QUERY_PARAMS.suburb,
    STATE_ELECTORAL_DISTRICT_URL: BASE_URL + ENDPOINTS.NSW_Administrative_Boundaries_Theme_District + QUERY_PARAMS.district
};