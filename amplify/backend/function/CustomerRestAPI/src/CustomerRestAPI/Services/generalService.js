const dbConn = require('../config');
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;
var envSettings = require('../utils/generalServices')

module.exports = {

    validateSubscriptionByAccessKey: async (req, res, isFromLicenseInformation) => {
        return new Promise(resolve => {
            if (req.body && req.body.accessKey) {
                let userQuery = `SELECT * FROM User WHERE accessKey ='${req.body.accessKey}'`

                dbConn.query(userQuery, async (err, result) => {
                    if (err) {

                        res.json({ err: err, body: req.body })
                    } else {

                        if (result && result.length > 0) {
                            try {
                                let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
                                let Env = await envSettings.envService(envQuery);
                                let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
                                merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET']);
                                merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET']);

                                let getRequest = new ApiContracts.GetCustomerProfileRequest();
                                getRequest.setCustomerProfileId(result[0].customerProfileId);
                                getRequest.setMerchantAuthentication(merchantAuthenticationType);

                                //pretty print request
                                console.log(JSON.stringify(getRequest.getJSON(), null, 2));

                                let ctrl = new ApiControllers.GetCustomerProfileController(getRequest.getJSON());
                                if (process.env.ENV == 'prod') {
                                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                                }
                                ctrl.execute(function () {

                                    let apiResponse = ctrl.getResponse();

                                    let response = new ApiContracts.GetCustomerProfileResponse(apiResponse);

                                    //pretty print response
                                    console.log(JSON.stringify(response, null, 2));

                                    if (response != null) {
                                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                            let subscriptionId
                                            if (response.subscriptionIds && response.subscriptionIds.subscriptionId && response.subscriptionIds.subscriptionId.length > 0 && response.subscriptionIds.subscriptionId[0]) {
                                                subscriptionId = response.subscriptionIds.subscriptionId[0]
                                            }
                                            if (subscriptionId) {
                                                let getSubscriptionRequest = new ApiContracts.ARBGetSubscriptionRequest();
                                                getSubscriptionRequest.setMerchantAuthentication(merchantAuthenticationType);
                                                getSubscriptionRequest.setSubscriptionId(subscriptionId);

                                                let ctrl = new ApiControllers.ARBGetSubscriptionController(getSubscriptionRequest.getJSON());

                                                ctrl.execute(function () {
                                                    let apiResponse = ctrl.getResponse();

                                                    let subscriptionResult = new ApiContracts.ARBGetSubscriptionResponse(apiResponse);

                                                    if (subscriptionResult != null) {
                                                        if (subscriptionResult.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                                            if (subscriptionResult.getSubscription().getStatus() == ApiContracts.ARBSubscriptionStatusEnum.ACTIVE) {
                                                                if (subscriptionResult && subscriptionResult.subscription && subscriptionResult.subscription.name === 'ENTERPRISE') {
                                                                    if (isFromLicenseInformation) {
                                                                        let pricingQuery = `SELECT SQL_CALC_FOUND_ROWS * from Pricing where usageType = 'metered' AND currency = 'usd' AND intervalTime = 'month' AND productId = '2' AND active = 'true'`;

                                                                        dbConn.query(pricingQuery, async (err, pricingData) => {
                                                                            if (err) {
                                                                                resolve(true)
                                                                            } else {
                                                                                if (pricingData && pricingData.length > 0) {
                                                                                    pricingData[0]['customer_profile_id'] = result[0].customerProfileId
                                                                                    if (response && response.profile && response.profile.paymentProfiles.length > 0 && response.profile.paymentProfiles[0] && response.profile.paymentProfiles[0].customerPaymentProfileId) {
                                                                                        pricingData[0]['customerPaymentProfileId'] = response.profile.paymentProfiles[0].customerPaymentProfileId
                                                                                    }
                                                                                    resolve(pricingData[0])
                                                                                } else {
                                                                                    resolve(true)
                                                                                }
                                                                            }
                                                                        })
                                                                    } else {
                                                                        resolve(true)
                                                                    }
                                                                } else {
                                                                    res.json({ err: 'You are not subscribed with enterprise plan', body: req.body })
                                                                }
                                                            }
                                                            else {
                                                                res.json({ err: `subscription is ${subscriptionResult.getSubscription().getStatus()}`, body: req.body })
                                                            }
                                                        }
                                                        else {
                                                            res.json({ err: 'subscription is not registered', body: req.body })
                                                        }
                                                    }
                                                    else {
                                                        res.json({ err: 'subscription is not registered', body: req.body })
                                                    }
                                                });
                                            } else {
                                                res.json({ err: 'subscription is not registered', body: req.body })
                                            }

                                        }
                                        else {
                                            res.json({ err: 'User is not registered', body: req.body })
                                        }
                                    }
                                    else {
                                        res.json({ err: "Null response received", body: req.body })

                                    }
                                });

                            } catch (e) {
                                res.json({ err: e })
                            }
                        } else {
                            res.json({ err: 'access Key not valid', url: req.body, })
                        }
                    }
                });
            } else {
                res.json({ err: 'access Key not provided', url: req.body, })
            }
        })
    }

}