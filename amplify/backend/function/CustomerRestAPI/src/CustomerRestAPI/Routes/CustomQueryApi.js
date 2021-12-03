

var express = require('express')
const route = express.Router();
const CustomQuery = require('../Services/CustomQuery');

route.post('/customers/getColumnName', CustomQuery.getColumnsByTableName);

route.post('/customers/saveQuery', CustomQuery.saveQuery);

route.post('/customers/getData', CustomQuery.getData);

route.post('/customers/getQueryByUser', CustomQuery.getQueryByUser);

route.post('/customers/deleteCustomQuery', CustomQuery.deleteCustomQuery);


module.exports = route