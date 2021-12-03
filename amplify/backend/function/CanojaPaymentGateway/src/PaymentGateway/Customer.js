

var express = require('express')
const route = express.Router()
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;
const dbConn = require('./config');
var moment = require("moment")
const services = require('./Service/generalService');

/**********************
  Example get method 
 **********************/

route.get('/paymentgateway/customers', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

        let response = await services.authorizenetServices(req, res, 'CUSTOMER_PROFILE_IDS', envQuery);

        return res.json({ success: 'get call succeed!', url: req.url, customers: response });
    } catch (err) {
        console.log(err)
        return res.json({ err: err, body: req.body })
    }
});

route.get('/paymentgateway/customers/:id', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

        let response = await services.authorizenetServices(req, res, 'CUSTOMER_BY_CUSTOMER_PROFILE_ID', envQuery);
        let userQuery = `select * from User where customerProfileId = ${req.params.id}`
        console.log(userQuery);
        dbConn.query(userQuery, (err, data) => {
            if (err) {
                res.json({ err: err, body: req.body })
            }
            if (data && data.length > 0) {

                if (data[0].subscriptionId) {
                    let subscriptionId = {
                        subscriptionId: []
                    }
                    if (data[0].planType === 'BASIC') {
                        response = {
                            ...response,
                            subscriptionIds: subscriptionId
                        }
                    } else {
                        response = {
                            ...response,
                            subscriptionIds: subscriptionId
                        }
                        response.subscriptionIds.subscriptionId = [data[0].subscriptionId]
                    }
                }
                return res.json({ success: 'get call succeed!', url: req.url, customer: response });
            } else {
                return res.json({ err: 'User not found', body: req.body })
            }
        })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

/****************************
 Example post method 
****************************/

route.post('/paymentgateway/customers', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
        let response = await services.authorizenetServices(req, res, 'CREATE_CUSTOMER_PROFILE', envQuery);

        return res.json({ success: 'post call succeed!', url: req.url, body: req.body, customer: response })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

route.post('/paymentgateway/customerspaymentprofile', async function (req, res) {
    try {

        let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

        let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT');`
        dbConn.query(envQuery, async (err, envVariable) => {
            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                if (envVariable && envVariable.length >= 2) {
                    let Env = {}
                    for (let i = 0; i < envVariable.length; i++) {
                        Env[envVariable[i].name] = envVariable[i].value
                    }
                    merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                    merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])

                    let getRequest = new ApiContracts.GetCustomerProfileRequest();
                    getRequest.setCustomerProfileId(req.body.customer_profile_id);
                    getRequest.setMerchantAuthentication(merchantAuthenticationType);

                    let ctrl = new ApiControllers.GetCustomerProfileController(getRequest.getJSON());
                    if (process.env.ENV == 'prod') {
                        ctrl.setEnvironment(SDKConstants.endpoint.production);
                    }
                    ctrl.execute(function () {

                        let apiResponse = ctrl.getResponse();

                        let UserProfileResponse = new ApiContracts.GetCustomerProfileResponse(apiResponse);
                        if (UserProfileResponse != null) {
                            if (UserProfileResponse.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {

                                let creditCard = new ApiContracts.CreditCardType();
                                creditCard.setCardNumber(req.body.card_no);
                                creditCard.setExpirationDate(req.body.expiry_date);

                                let paymentType = new ApiContracts.PaymentType();
                                paymentType.setCreditCard(creditCard);

                                let customerAddress = new ApiContracts.CustomerAddressType();
                                customerAddress.setFirstName(req.body.given_name);
                                customerAddress.setLastName(req.body.family_name);
                                customerAddress.setAddress(req.body.address);
                                customerAddress.setCity(req.body.city);
                                customerAddress.setState(req.body.state);
                                customerAddress.setZip(req.body.zip);
                                customerAddress.setCountry(req.body.country);
                                customerAddress.setPhoneNumber(req.body.phone_no);

                                let profile = new ApiContracts.CustomerPaymentProfileType();
                                profile.setPayment(paymentType);
                                profile.setBillTo(customerAddress);

                                let createRequest = new ApiContracts.CreateCustomerPaymentProfileRequest();

                                createRequest.setMerchantAuthentication(merchantAuthenticationType);
                                createRequest.setCustomerProfileId(req.body.customer_profile_id);
                                createRequest.setPaymentProfile(profile);
                                if (process.env.ENV == 'prod') {
                                    createRequest.setValidationMode(ApiContracts.ValidationModeEnum.LIVEMODE);
                                }

                                let ctrl = new ApiControllers.CreateCustomerPaymentProfileController(createRequest.getJSON());
                                if (process.env.ENV == 'prod') {
                                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                                }
                                ctrl.execute(function () {

                                    let apiResponse = ctrl.getResponse();

                                    let paymentProfileResponse = new ApiContracts.CreateCustomerPaymentProfileResponse(apiResponse);

                                    if (paymentProfileResponse != null) {
                                        if (paymentProfileResponse.getMessages().getMessage()[0].getCode() == "E00039") {
                                            let userUpdateQuery = `update User SET planType = '${req.body.subscription_name}', createdAt = '${moment(new Date()).format('MM-DD-YYYY')}', subscriptionId = 'BASIC_${req.body.customer_profile_id}'  WHERE customerProfileId = ${req.body.customer_profile_id}`
                                            dbConn.query(userUpdateQuery, async function (err, data) {
                                                if (err) {
                                                    return res.json({ err: err, body: req.body })
                                                } else {
                                                    paymentProfileResponse = {
                                                        PaymentProfileId: paymentProfileResponse.getCustomerPaymentProfileId(),
                                                        result_code: "Ok",
                                                        response_code: "I00001",
                                                        message: "Successful."
                                                    }
                                                    req.Env = Env
                                                    req.email = UserProfileResponse.profile.email
                                                    req.subscription = 'BASIC'
                                                    await services.sendEmailService(req, res);
                                                    return res.json({ success: 'post call succeed!', url: req.url, body: req.body, paymentProfile: paymentProfileResponse })
                                                }
                                            })
                                        }
                                        else if (paymentProfileResponse.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                            let userUpdateQuery = `update User SET planType = '${req.body.subscription_name}', createdAt = '${moment(new Date()).format('MM-DD-YYYY')}', subscriptionId = 'BASIC_${req.body.customer_profile_id}'  WHERE customerProfileId = ${req.body.customer_profile_id}`
                                            dbConn.query(userUpdateQuery, async function (err, data) {
                                                if (err) {
                                                    res.json({ err: err, body: req.body })
                                                } else {
                                                    paymentProfileResponse = {
                                                        PaymentProfileId: paymentProfileResponse.getCustomerPaymentProfileId(),
                                                        result_code: paymentProfileResponse.getMessages().getResultCode(),
                                                        response_code: paymentProfileResponse.getMessages().getMessage()[0].getCode(),
                                                        message: paymentProfileResponse.getMessages().getMessage()[0].getText()
                                                    }
                                                    req.Env = Env
                                                    req.email = UserProfileResponse.profile.email
                                                    req.subscription = 'BASIC'
                                                    await services.sendEmailService(req, res);

                                                    return res.json({ success: 'post call succeed!', url: req.url, body: req.body, paymentProfile: paymentProfileResponse })
                                                }
                                            })
                                        } else {
                                            return res.json({ err: paymentProfileResponse, body: req.body })
                                        }
                                    } else {
                                        return res.json({ err: "Null Response.", body: req.body })
                                    }
                                })
                            }
                            else {
                                return res.json({ err: UserProfileResponse, url: req.url, body: req.body })
                            }
                        } else {
                            return res.json({ err: 'Null response received!', url: req.url, body: req.body })
                        }
                    })
                } else {
                    return res.json({ err: 'Env not found!', url: req.url, body: req.body })
                }
            }
        })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

route.post('/paymentgateway/createcustomerspaymentprofile', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

        let paymentProfileResponse = await services.authorizenetServices(req, res, 'CREATE_CUSTOMER_PAYMENT_PROFILE', envQuery);

        if (paymentProfileResponse.messages.message[0].code == "E00039") {
            paymentProfileResponse = {
                PaymentProfileId: paymentProfileResponse.customerPaymentProfileId,
                result_code: "Ok",
                response_code: "I00001",
                message: "Successful."
            }
            return res.json({ success: 'post call succeed!', url: req.url, body: req.body, paymentProfile: paymentProfileResponse })
        }
        else if (paymentProfileResponse.messages.resultCode == ApiContracts.MessageTypeEnum.OK) {
            if (paymentProfileResponse.messages.message[0].code === 'I00001') {
                paymentProfileResponse = {
                    PaymentProfileId: paymentProfileResponse.customerProfileId,
                    result_code: paymentProfileResponse.messages.resultCode,
                    response_code: paymentProfileResponse.messages.message[0].code,
                    message: paymentProfileResponse.messages.message[0].text
                }
                res.json({ success: 'post call succeed!', paymentProfile: paymentProfileResponse, res: 2 })
            } else {
                paymentProfileResponse = {
                    result_code: paymentProfileResponse.messages.resultCode,
                    response_code: paymentProfileResponse.messages.message[0].code,
                    message: paymentProfileResponse.messages.message[0].text
                }
                res.json({ err: 'post call err!', url: req.url, body: req.body, paymentProfile: paymentProfileResponse, res: 3 })
            }
        } else {
            return res.json({ err: paymentProfileResponse, body: req.body })
        }

    } catch (err) {
        res.json({ err: err, body: req.body, res: 9 })
    }
});

route.post('/paymentgateway/customers', function (req, res) {
    // Add your code here
    res.json({ success: 'post call succeed!', url: req.url, body: req.body, })
});

/****************************
 Example put method 
****************************/

route.put('/paymentgateway/paymentprofile/update', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

        let paymentProfileResponse = await services.authorizenetServices(req, res, 'UPDATE_CUSTOMER_PAYMENT_PROFILE', envQuery)

        return res.json({ success: 'post call succeed!', paymentProfile: paymentProfileResponse })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

module.exports = route