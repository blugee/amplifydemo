

var express = require('express')
const route = express.Router();
const dbConn = require('./config');
const moment = require('moment')
var service = require('./Service/generalService');

route.get('/paymentgateway/subscription', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
        let response = await service.authorizenetServices(req, res, 'GET_ALL_ACTIVE_SUBSCRIPTION_LIST', envQuery)

        return res.json({ success: 'get call succeed!', subscriptions: response });

    } catch (err) {
        return res.json({ err: err, body: req.body })
    }
});

route.get('/paymentgateway/subscription/:id', async function (req, res) {
    try {
        if (req.params.id) {
            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
            let response = await service.authorizenetServices(req, res, 'GET_SUBSCRIPTION_BY_ID', envQuery)

            return res.json({ success: 'get call succeed!', subscription: response });

        }
    } catch (err) {
        return res.json({ err: err, body: req.body })
    }
});

/****************************
* Example post method *
****************************/

route.post('/paymentgateway/subscription', async function (req, res) {
    try {
        if (req.body.customer_profile_id) {
            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
            let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
            let UserProfileResponse = response.UserProfileResponse

            // Pricing Id
            if (req.body.price_id) {
                let pricingQuery = `select * from Pricing where id = ${req.body.price_id}`
                dbConn.query(pricingQuery, async (err, data) => {
                    if (err) {
                        res.json({ err: err, body: req.body, res: 2 })
                    } else {
                        if (UserProfileResponse && UserProfileResponse.profile && UserProfileResponse.profile.paymentProfiles && UserProfileResponse.profile.paymentProfiles.length > 0) {
                            req.UserProfileResponse = UserProfileResponse
                            req.price = data
                            let subscription = await service.authorizenetServices(req, res, 'CREATE_SUBSCRIPTION', envQuery)

                            let updateUser = `update User set discount = ${req.body.discount}, subscriptionId = ${subscription.subscriptionId} where customerProfileId = ${req.body.customer_profile_id}`
                            dbConn.query(updateUser, (err, data) => {
                                if (err) {
                                    return res.json({ err: err, url: req.url, body: req.body, res: 3 })
                                } else {
                                    return res.json({ success: 'post call succeed!', url: req.url, body: req.body, subscription: subscription, res: 4 })
                                }
                            })
                        } else {
                            return res.json({ err: 'Payment profile not found!', body: req.body, res: 5 })
                        }
                    }
                });
            }
        } else {
            return res.json({ err: 'Please Provide customerProfileId', body: req.body, res: 6 })
        }
    } catch (err) {
        return res.json({ err: err, body: req.body, res: 7 })
    }
});

route.post('/paymentgateway/subscription/:id', async function (req, res) {
    try {
        if (req.body.price_id) {
            let pricingQuery = `select * from Pricing where id = ${req.body.price_id}`;
            dbConn.query(pricingQuery, async (err, data) => {
                if (err) {
                    res.json({ err: err, body: req.body });
                } else {
                    if (data && data.length > 0) {
                        req.price = data
                        if (req.params.id) {
                            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`;
                            let response = await service.authorizenetServices(req, res, "UPDATE_SUBSCRIPTION", envQuery);

                            return res.json({ success: 'post call succeed!', subscription: response });
                        } else {
                            return res.json({ err: 'Please provide subscriptionId!', body: req.body, url: req.url });
                        }
                    } else {
                        return res.json({ err: 'Pricing not found!', body: req.body, url: req.url });
                    }
                }
            })
        }
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

route.post('/paymentgateway/subscription/update/basic', async function (req, res) {
    try {
        if (req.body.customer_profile_id) {
            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`;
            let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery);
            let UserProfileResponse = response.UserProfileResponse

            if (req.body.price_id) {
                let pricingQuery = `select * from Pricing where id = ${req.body.price_id}`
                dbConn.query(pricingQuery, async (err, data) => {
                    if (err) {
                        res.json({ err: err, body: req.body, res: 2 })
                    } else {
                        let userQuery = `select * from User where customerProfileId = ${req.body.customer_profile_id}`
                        dbConn.query(userQuery, async function (err, userData) {
                            if (err) {
                                res.json({ err: err, body: req.body, res: 3 })
                            } else {
                                if (userData && userData.length > 0) {

                                    if (UserProfileResponse && UserProfileResponse.profile && UserProfileResponse.profile.paymentProfiles && UserProfileResponse.profile.paymentProfiles.length > 0) {
                                        req.UserProfileResponse = UserProfileResponse
                                        req.price = data
                                        let subscription = await service.authorizenetServices(req, res, 'CREATE_SUBSCRIPTION', envQuery)

                                        let userUpdateQuery = `update User SET planType = NULL, createdAt = '${moment(new Date()).format('MM-DD-YYYY')}', discount = ${req.body.discount ? req.body.discount : "0"}, subscriptionId = ${subscription.subscriptionId}  WHERE customerProfileId = ${req.body.customer_profile_id}`
                                        dbConn.query(userUpdateQuery, function (err, data) {
                                            if (err) {
                                                res.json({ err: err, body: req.body, res: 4 })
                                            } else {
                                                let findCanceledSubscriptionQuery = `select * from CanceledSubscription where customerProfileId = ${req.body.customer_profile_id};`
                                                dbConn.query(findCanceledSubscriptionQuery, (err, canceledSubscriptionData) => {
                                                    if (err) {
                                                        return res.json({ err: err, body: req.body, res: 5 })
                                                    } else {
                                                        if (canceledSubscriptionData && canceledSubscriptionData.length > 0) {
                                                            let deleteCanceledSubscriptionQuery = `delete  from CanceledSubscription where id = ${canceledSubscriptionData[0].id};`
                                                            dbConn.query(deleteCanceledSubscriptionQuery, function (err, deleteCanceledSubscriptionData) {
                                                                if (err) {
                                                                    return res.json({ err: err, body: req.body, res: 6 })
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                                return res.json({ success: 'post call succeed!', url: req.url, body: req.body, subscription: subscription, res: 15 })
                                            }
                                        })
                                    } else {
                                        return res.json({ err: 'Payment profile not found!', body: req.body, res: 5 })
                                    }
                                } else {
                                    return res.json({ err: "No data found with given user", body: req.body, res: 9 })
                                }
                            }
                        })
                    }
                });
            }
        }
    } catch (err) {
        return res.json({ err: err, body: req.body, res: 11 })
    }
})


route.post('/paymentgateway/updatesubscription/:id', async function (req, res) {
    try {
        if (req.body.price_id) {
            let pricingQuery = `select * from Pricing where id = ${req.body.price_id}`

            dbConn.query(pricingQuery, async function (err, data) {
                if (err) {
                    res.json({ err: err, body: req.body })
                }
                else {
                    if (req.params.id) {

                        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

                        let userQuery = `SELECT * FROM User where customerProfileId = ${req.body.customer_profile_id}`
                        dbConn.query(userQuery, async function (err, userData) {
                            if (err) {
                                res.json({ err: err, url: req.url, body: req.body })
                            } else {
                                if (userData && userData.length > 0) {
                                    req.price = data
                                    req.userData = userData
                                    let response = await service.authorizenetServices(req, res, 'UPDATE_SUBSCRIPTION_OLD_DISCOUNT', envQuery);

                                    let deleteCancelSubQuery = `delete from CanceledSubscription where customerProfileId = '${req.body.customer_profile_id}'`
                                    dbConn.query(deleteCancelSubQuery, async (err, queryResult) => {
                                        if (err) {
                                            res.json({ err: err, url: req.url, body: req.body })
                                        }
                                    })
                                    return res.json({ success: 'post call succeed!', subscription: response })
                                } else {
                                    return res.json({ err: 'User not found!', url: req.url, body: req.body })
                                }
                            }
                        })
                    }
                }
            })
        }
    } catch (err) {
        res.json({ err: err, body: req.body, server: "ERROR" })
    }
});

route.post('/paymentgateway/pagination/subscription', async function (req, res) {
    try {

        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

        let response = await service.authorizenetServices(req, res, 'SUBSCRIPTION_PAGINATION', envQuery)

        return res.json({ success: 'get call succeed!', subscriptions: response })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

route.delete('/paymentgateway/subscription/:id', async function (req, res) {
    try {

        if (req.params.id) {

            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
            let response = await service.authorizenetServices(req, res, 'DELETE_SUBSCRIPTION', envQuery)

            return res.json({ success: 'Subscription canceled successfully', body: response });
        }
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

module.exports = route
