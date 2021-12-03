var express = require('express')
const route = express.Router();
const GoogleApi = require('../Services/GoogleApi');

route.post('/customers/getPlaceDetails', GoogleApi.getPlaceData);

module.exports = route