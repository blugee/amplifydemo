var express = require('express')
const route = express.Router()

const licenseInformation = require('./licenseInformationApi');
const CustomQuery = require('./CustomQueryApi');
const GooglePlaceApi = require('./GooglePlaceApi');
const ReCaptcha = require('./recaptcha');


route.use(
    '/',
    licenseInformation,
    CustomQuery,
    GooglePlaceApi,
    ReCaptcha
)

module.exports = route