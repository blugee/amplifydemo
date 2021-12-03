/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const indexroutesForPaymentGatewayAPI = require('./PaymentGateway')
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var AWS = require('aws-sdk')
var https = require('https')
const CronJob = require('./PaymentGateway/CronJob')


const agent = new https.Agent({
  maxSockets: 300,
  keepAlive: true
});

AWS.config.update({
  logger: console,
  httpOptions: {
    timeout: 45000,
    connectTimeout: 45000,
    agent: agent
  },
  maxRetries: 10,
  retryDelayOptions: {
    base: 500
  }
});

CronJob.Charges();
CronJob.CancelSubscription();


// declare a new express app
var app = express()

app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


app.use(indexroutesForPaymentGatewayAPI);

app.listen(3000, function () {
  console.log("App started")
});



// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
