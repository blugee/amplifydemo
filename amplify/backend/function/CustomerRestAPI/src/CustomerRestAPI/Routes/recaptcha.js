
var express = require('express')
const route = express.Router();
const reCaptcha = require('../Services/recaptcha');

route.post('/customers/verify/recatptcha', reCaptcha.verifyReCaptcha);

module.exports = route