

var express = require('express')
const route = express.Router()
var AWS = require('aws-sdk')
const dbConn = require('./config');
var services = require('./Service/generalService');

route.post('/paymentgateway/deleteUser', async function (req, res) {

    try {
        if (req.body.email || req.body.customerId) {
            let envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

            let email = req.body.email
            req.body.customer_profile_id = req.body.customerId

            if (!req.body.email) {

                let response = await services.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
                console.log("response >>", response)
                let userProfile = response.UserProfileResponse
                let Env = response.Env

                email = userProfile.profile.email
                var params = {
                    Filter: `email=\"${email}\"`,
                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                };

                await AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                await cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                    if (err) {
                        return res.json({ err: err, body: req.body, res: "users not found" })
                    }
                    else {
                        if (data && data.Users.length > 0) {
                            var deleteParams = {
                                Username: data.Users[0].Username,
                                UserPoolId: Env['REACT_APP_USER_POOL_ID']
                            };
                            await cognitoidentityserviceprovider.adminDeleteUser(deleteParams, (err, data1) => {
                                if (err) {
                                    return res.json({ err: err, body: req.body, res: "2" })
                                }
                            })

                            if (req.body.customerId) {
                                let deleteUserQuery = `delete from User where customerProfileId ='${req.body.customerId}';`;

                                await dbConn.query(deleteUserQuery, async (err, result) => {
                                    if (err) {
                                        return res.json({ err: err, body: req.body, res: "4" })
                                    }
                                })

                                let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

                                let deleteResponse = await services.authorizenetServices(req, res, 'DELETE_CUSTOMER_PROFILE', envQuery)

                                return res.json({ success: 'post call succeed!', body: req.body, response: deleteResponse })
                            }

                        } else {
                            return res.json({ err: 'not data found', body: req.body, res: "6", result: data })
                        }
                    }
                })
                res.json({ success: 'get call succeed!', url: req.url, customer: response });

            } else {
                envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY'`
                let Env = await services.envService(envQuery)
                var params = {
                    Filter: `email=\"${email}\"`,
                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                };


                await AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                await cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                    if (err) {
                        return res.json({ err: err, body: req.body, res: "users not found" })
                    }
                    else {
                        if (data && data.Users.length > 0) {
                            var deleteParams = {
                                Username: data.Users[0].Username,
                                UserPoolId: Env['REACT_APP_USER_POOL_ID']
                            };
                            await cognitoidentityserviceprovider.adminDeleteUser(deleteParams, (err, data1) => {
                                if (err) {
                                    return res.json({ err: err, body: req.body, res: "2" })
                                }
                            })

                            if (req.body.customerId) {
                                let deleteUserQuery = `delete from User where customerProfileId ='${req.body.customerId}';`;

                                await dbConn.query(deleteUserQuery, async (err, result) => {
                                    if (err) {
                                        return res.json({ err: err, body: req.body, res: "4" })
                                    }
                                })
                                envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

                                let deleteResponse = await services.authorizenetServices(req, res, 'DELETE_CUSTOMER_PROFILE', envQuery)

                                return res.json({ success: 'post call succeed!', url: req.url, body: req.body, deleteResponse })
                            } else {
                                return res.json({ err: 'Please provide customerProfileId!', body: req.body })
                            }

                        } else {
                            return res.json({ err: 'not data found', body: req.body, res: "6", result: data })
                        }
                    }
                })
            }

        } else {
            return res.json({ err: 'Please provide email', body: req.body, })
        }
    } catch (err) {
        return res.json({ err: err, body: req.body, res: "5" })
    }
});



module.exports = route
