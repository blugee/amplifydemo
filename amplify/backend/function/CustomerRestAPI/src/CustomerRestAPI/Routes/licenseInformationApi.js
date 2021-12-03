

var express = require('express')
const route = express.Router();
const licenseInformationServise = require('../Services/licenseInformationServise');
const licenseCategoryServise = require('../Services/licenseCategoryService');
const licenseStatusServise = require('../Services/licenseStatusService');

route.post('/customers/licenseInformation', licenseInformationServise.getLicenseInformation);

route.post('/customers/licenseCategory', licenseCategoryServise.getLicenseCategory);

route.post('/customers/licenseStatus', licenseStatusServise.getLicenseStatus);

module.exports = route