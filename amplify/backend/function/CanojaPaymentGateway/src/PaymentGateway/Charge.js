var express = require('express')
const route = express.Router()
var AWS = require('aws-sdk')
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
const dbConn = require('./config');
const utils = require('./Utils/utils');
var templateService = require('./Service/EmailtemplateService')
var generalService = require('./Service/generalService')
var SDKConstants = require('authorizenet').Constants;



route.post('/paymentgateway/charge', async function (req, res) {

    try {
        let productId = 3
        if (req.body.plan === 'ENTERPRISE') {
            productId = 4
        }

        let pricingQuery = `select * from Pricing where usageType = 'metered' AND intervalTime = '${req.body.interval}' AND productId = '${productId}' AND active = 'true'`;

        dbConn.query(pricingQuery, async function (err, data) {
            if (err) {
                return res.json({ err: err, body: req.body })
            } else {
                if (data && data.length > 0) {
                    let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
                    let response = await generalService.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
                    let userProfile = response.UserProfileResponse

                    let total
                    if (data[0].pricePerUnit) {
                        total = Number(data[0].pricePerUnit) * req.body.no_of_records_fetch
                    }

                    if (req.body.discount && Number(req.body.discount) > 0) {
                        total = total - Number(req.body.discount)
                    }
                    if (total > 0) {
                        let chargeQuery = `INSERT INTO Charge (customerProfileId, customerPaymentProfileId, priceId, description, productName, noOfRecordsFetch, chargeAmount, pricePerUnit, isBilled)
                                                               VALUES ('${req.body.customer_profile_id}', '${userProfile.profile.paymentProfiles[0].customerPaymentProfileId}', '${data[0].id}', '${req.body.description}', '${req.body.product_name}', '${req.body.no_of_records_fetch}', '${total}', '${data[0].pricePerUnit}', 'false');`
                        dbConn.query(chargeQuery, function (err, charge) {
                            if (err) {
                                console.log(err);
                                return res.json({ err: err, body: req.body, chargeAmount: total, Price: data })
                            } else {
                                return res.json({ success: 'post call succeed!', url: req.url, body: req.body, charge: charge })
                            }
                        })
                    }
                }
                else {
                    return res.json({ err: "No price found", body: req.body })
                }
            }
        })
    } catch (err) {
        console.log(err)
        return res.json({ err: err, body: req.body })
    }
});

route.get('/paymentgateway/charge/:customerId', function (req, res) {

    try {
        if (req.params.customerId) {
            let chargeQuery = `select * from Charge where customerProfileId = '${req.params.customerId}' AND isBilled = 'false';`;

            dbConn.query(chargeQuery, function (err, data) {
                if (err) {
                    res.json({ err: err, body: req.body })
                } else {
                    res.json({ success: 'get call succeed!', url: req.url, body: req.body, Charge: data })
                }
            })
        }
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
})

route.post('/paymentgateway/pagination/charge', function (req, res) {
    try {
        const { page, size } = req.body;
        let { limit, offset } = utils.getPagination(page, size);

        let chargeQuery = `select * from Charge where isBilled = 'false' ORDER BY id DESC LIMIT ${limit} OFFSET ${offset};`;
        let countQuery = `SELECT COUNT(id) AS total FROM Charge where isBilled = 'false';`
        dbConn.query(countQuery, function (err, count) {
            dbConn.query(chargeQuery, function (err, data) {
                if (err) {
                    res.json({ err: err, body: req.body })
                } else {
                    if (data) {
                        if (err) {
                            res.json({ err: err, body: req.body })
                        } else {
                            count = count[0].total
                            data = utils.getPagingData(data, count, page, size);
                            res.json({ success: 'get call succeed!', url: req.url, body: req.body, Charge: data })
                        }
                    }
                }
            })
        })
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
})

route.post('/paymentgateway/addcharge', async function (req, res) {
    try {
        let interval = req.body.interval
        let productId = 5
        let pricingQuery = `select * from Pricing where usageType = 'metered' AND intervalTime = '${interval}' AND productId = '${productId}' AND active = 'true'`;

        dbConn.query(pricingQuery, function (err, data) {
            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                if (data && data.length > 0) {
                    let total = data[0].pricePerUnit

                    if (data[0].pricePerUnit && req.body.no_of_records_fetch) {
                        total = Number(data[0].pricePerUnit) * req.body.no_of_records_fetch
                    }
                    if (req.body.discount && Number(req.body.discount) > 0) {
                        total = total - Number(req.body.discount)
                    }

                    if (Number(total) > 0) {
                        let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

                        let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET');`
                        dbConn.query(envQuery, async (err, envVariable) => {
                            if (err) {
                                res.json({ err: err, body: req.body })
                            } else {
                                if (envVariable && envVariable.length === 2) {
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

                                                let profileToCharge = new ApiContracts.CustomerProfilePaymentType();
                                                profileToCharge.setCustomerProfileId(req.body.customer_profile_id);

                                                let paymentProfile = new ApiContracts.PaymentProfile();
                                                paymentProfile.setPaymentProfileId(UserProfileResponse.profile.paymentProfiles[0].customerPaymentProfileId);
                                                profileToCharge.setPaymentProfile(paymentProfile);

                                                let orderDetails = new ApiContracts.OrderType();
                                                orderDetails.setInvoiceNumber(`INV-${Math.floor((Math.random() * 10000000) + 1)} `);
                                                orderDetails.setDescription(req.body.description);

                                                let lineItem_id = new ApiContracts.LineItemType();
                                                lineItem_id.setItemId('1');
                                                lineItem_id.setName(req.body.product_name);
                                                lineItem_id.setDescription(req.body.description);
                                                lineItem_id.setQuantity(req.body.no_of_records_fetch);
                                                lineItem_id.setUnitPrice(data[0].pricePerUnit);

                                                let lineItemList = [];
                                                lineItemList.push(lineItem_id);

                                                let lineItems = new ApiContracts.ArrayOfLineItem();
                                                lineItems.setLineItem(lineItemList);

                                                let transactionRequestType = new ApiContracts.TransactionRequestType();
                                                transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
                                                transactionRequestType.setProfile(profileToCharge);
                                                transactionRequestType.setAmount(total);
                                                transactionRequestType.setOrder(orderDetails);

                                                let createRequest = new ApiContracts.CreateTransactionRequest();
                                                createRequest.setMerchantAuthentication(merchantAuthenticationType);
                                                createRequest.setTransactionRequest(transactionRequestType);

                                                let ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
                                                if (process.env.ENV == 'prod') {
                                                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                                                }
                                                ctrl.execute(function () {

                                                    let apiResponse = ctrl.getResponse();

                                                    let response = new ApiContracts.CreateTransactionResponse(apiResponse);

                                                    if (response != null) {
                                                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                                            if (response.getTransactionResponse().getMessages() != null) {
                                                                return res.json({ success: 'post call succeed!', url: req.url, body: req.body, charge: response, Price: data })
                                                            }
                                                            else {
                                                                if (response.getTransactionResponse().getErrors() != null) {
                                                                    return res.json({ err: response, body: req.body })
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                                                                return res.json({ err: response, body: req.body })
                                                            }
                                                            else {
                                                                return res.json({ err: response, body: req.body })
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        return res.json({ err: "Null Response in transaction.", body: req.body })
                                                    }
                                                });
                                            } else {
                                                return res.json({ err: UserProfileResponse, body: req.body });
                                            }
                                        } else {
                                            return res.json({ err: "Null Response User Profile Not Found.", body: req.body })
                                        }
                                    })
                                } else {
                                    return res.json({ err: 'Env not found!', url: req.url, body: req.body })
                                }
                            }
                        })
                    }

                } else {
                    res.json({ err: "Null Response Price Not Found.", body: req.body })
                }
            }
        })
    } catch (err) {
        res.json({ err: err, body: req.body })

    }
});

route.post('/paymentgateway/chargeCronTest', async function (req, res) {
    try {
        let distinctQuery = `SELECT DISTINCT customerProfileId, customerPaymentProfileId FROM Charge where isBilled = 'false';`
        dbConn.query(distinctQuery, (err, userIds) => {
            if (err) {
                console.log({ err: JSON.stringify(err, null, 2) })
                res.json({ err: JSON.stringify(err, null, 2) })
            } else {
                let success = []
                for (let i = 0; i < userIds.length; i++) {
                    const element = userIds[i];
                    console.log("Charge For User >> ", element)
                    let chargeQuery = `select * from Charge where customerProfileId  = '${element.customerProfileId}' AND isBilled = 'false';`
                    dbConn.query(chargeQuery, (err, data) => {
                        if (err) {
                            console.log(err)
                            res.json({ err: err })
                        } else {
                            if (data && data.length > 0) {
                                let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

                                let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET');`
                                dbConn.query(envQuery, async (err, envVariable) => {
                                    if (err) {
                                        res.json({ err: err, body: req.body })
                                    } else {
                                        if (envVariable && envVariable.length === 2) {
                                            let Env = {}
                                            for (let i = 0; i < envVariable.length; i++) {
                                                Env[envVariable[i].name] = envVariable[i].value
                                            }
                                            merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                                            merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])


                                            let profileToCharge = new ApiContracts.CustomerProfilePaymentType();
                                            profileToCharge.setCustomerProfileId(element.customerProfileId);

                                            let paymentProfile = new ApiContracts.PaymentProfile();
                                            paymentProfile.setPaymentProfileId(element.customerPaymentProfileId);
                                            profileToCharge.setPaymentProfile(paymentProfile);

                                            let orderDetails = new ApiContracts.OrderType();
                                            orderDetails.setInvoiceNumber(`INV-${Math.floor((Math.random() * 10000000) + 1)} `);
                                            orderDetails.setDescription("Monthly charge clearing");

                                            let lineItemList = [];
                                            let amount = [];
                                            let ids = []
                                            for (let a = 0; a < data.length; a++) {
                                                const obj = data[a];
                                                let userCredit = obj.pricePerUnit * obj.noOfRecordsFetch - obj.chargeAmount
                                                let lineItem_id = new ApiContracts.LineItemType();
                                                lineItem_id.setItemId(a + 1);
                                                lineItem_id.setName(obj.productName);
                                                lineItem_id.setDescription(`${obj.description} (Discount ${userCredit})`);
                                                lineItem_id.setQuantity(obj.noOfRecordsFetch);
                                                lineItem_id.setUnitPrice(obj.pricePerUnit);

                                                lineItemList.push(lineItem_id);
                                                amount.push(obj.chargeAmount);
                                                ids.push(obj.id);
                                            }
                                            let idArray = ''

                                            for (let i = 0; i < ids.length; i++) {
                                                const element = ids[i]
                                                if (ids.length - 1 === i) {
                                                    idArray += `'${element}'`
                                                } else {
                                                    idArray += `'${element}',`
                                                }
                                            }
                                            let chargeAmount = amount.reduce((a, b) => Number(a) + Number(b), 0)

                                            let lineItems = new ApiContracts.ArrayOfLineItem();
                                            lineItems.setLineItem(lineItemList);

                                            let transactionRequestType = new ApiContracts.TransactionRequestType();
                                            transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
                                            transactionRequestType.setProfile(profileToCharge);
                                            transactionRequestType.setAmount(chargeAmount.toFixed(2));
                                            transactionRequestType.setLineItems(lineItems);
                                            transactionRequestType.setOrder(orderDetails);

                                            let createRequest = new ApiContracts.CreateTransactionRequest();
                                            createRequest.setMerchantAuthentication(merchantAuthenticationType);
                                            createRequest.setTransactionRequest(transactionRequestType);

                                            let ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());
                                            if (process.env.ENV == 'prod') {
                                                ctrl.setEnvironment(SDKConstants.endpoint.production);
                                            }
                                            ctrl.execute(function () {

                                                let apiResponse = ctrl.getResponse();

                                                let response = new ApiContracts.CreateTransactionResponse(apiResponse);

                                                if (response != null) {
                                                    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                                        if (response.getTransactionResponse().getMessages() != null) {
                                                            console.log({ success: 'post call succeed!', url: req.url, charge: response, Price: data })
                                                            console.log("idArray >> ", idArray)
                                                            let updateChargeQuery = `UPDATE Charge SET isBilled = 'true' WHERE id IN (${idArray});`
                                                            console.log("updateChargeQuery >> ", updateChargeQuery)
                                                            dbConn.query(updateChargeQuery, (err, updateData) => {
                                                                if (err) {
                                                                    console.log({ err: JSON.stringify(err, null, 2) })
                                                                    res.json({ err: JSON.stringify(err, null, 2) })
                                                                }
                                                                else {
                                                                    success.push(updateChargeQuery)
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            if (response.getTransactionResponse().getErrors() != null) {
                                                                console.log({ err: JSON.stringify(response, null, 2) })
                                                                res.json({ err: JSON.stringify(response, null, 2) })
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                                                            console.log({ err: JSON.stringify(response, null, 2) })
                                                            res.json({ err: response })
                                                        }
                                                        else {
                                                            console.log({ err: JSON.stringify(response, null, 2) })
                                                            res.json({ err: response })
                                                        }
                                                    }
                                                }
                                                else {
                                                    console.log({ err: "Null Response in transaction." })
                                                    res.json({ err: "Null Response in transaction." })
                                                }
                                            });
                                        } else {
                                            return res.json({ err: 'Env not found!', url: req.url, body: req.body })
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
                if (userIds.length === success.length) {
                    res.json({ success: "Charge Done", data: success })
                }
            }
        })
    } catch (err) {
        console.log({ err: JSON.stringify(err, null, 2) })
        res.json({ err: err, body: req.body })
    }
});

route.post('/paymentgateway/canclesubscriptionapi', (req, res) => {
    try {
        let subscriptionQuery = `SELECT * FROM CanceledSubscription where isCancelApplied = 'true' AND isCanceled = 'false';`
        dbConn.query(subscriptionQuery, (err, subscription) => {
            if (err) {
                console.log({ err: JSON.stringify(err, null, 2) });
                res.json({ err: err })
            } else {
                let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
                let Env = {}
                let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT');`
                dbConn.query(envQuery, async (err, envVariable) => {
                    if (err) {
                        res.json({ err: err, body: req.body })
                    } else {
                        if (envVariable && envVariable.length > 0) {

                            for (let i = 0; i < envVariable.length; i++) {
                                Env[envVariable[i].name] = envVariable[i].value
                            }
                            merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                            merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])

                            for (let i = 0; i < subscription.length; i++) {
                                const element = subscription[i];


                                let getRequest = new ApiContracts.GetCustomerProfileRequest();
                                getRequest.setCustomerProfileId(element.customerProfileId);
                                getRequest.setMerchantAuthentication(merchantAuthenticationType);

                                let ctrl = new ApiControllers.GetCustomerProfileController(getRequest.getJSON());

                                if (process.env.ENV == 'prod') {
                                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                                }

                                ctrl.execute(async function () {

                                    let apiResponse = ctrl.getResponse();

                                    let response = new ApiContracts.GetCustomerProfileResponse(apiResponse);

                                    if (response != null) {
                                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                            let email = response.getProfile().getEmail();
                                            console.log('email >> ', email)
                                            if (email) {
                                                let params = {
                                                    Filter: `email=\"${email}\"`,
                                                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                                                };

                                                await AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                                                let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                                                await cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                                                    if (err) {
                                                        console.log({ err: err })
                                                        res.json({ err: err })
                                                    }
                                                    else {
                                                        if (data && data.Users.length > 0) {
                                                            console.log("Data User >> data.Users",)
                                                            // Check For Basic Subscription
                                                            let matchStr = /BASIC_/;
                                                            if (matchStr.test(element.subscriptionId)) {
                                                                console.log("BASIC SUBSCRIPTION >> ", matchStr.test(element.subscriptionId))
                                                                let deleteParams = {
                                                                    Username: data.Users[0].Username,
                                                                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                                                                };
                                                                await cognitoidentityserviceprovider.adminDeleteUser(deleteParams, (err, data1) => {
                                                                    if (err) {
                                                                        console.log({ err: err, res: "2" })
                                                                    }
                                                                })

                                                                let deletePendingReportQuery = `delete from PendingReport where username = '${data.Users[0].Username}';`;

                                                                await dbConn.query(deletePendingReportQuery, async (err, result) => {
                                                                    if (err) {
                                                                        console.log({ err: err, res: "3" })
                                                                    }
                                                                })

                                                                let deletePurchaseReportQuery = `delete from PurchaseReport where username = '${data.Users[0].Username}';`;

                                                                await dbConn.query(deletePurchaseReportQuery, async (err, result) => {
                                                                    if (err) {
                                                                        console.log({ err: err, res: "4" })
                                                                    }
                                                                })

                                                                let deleteUserQuery = `delete from User where customerProfileId ='${element.customerProfileId}';`;

                                                                await dbConn.query(deleteUserQuery, async (err, result) => {
                                                                    if (err) {
                                                                        console.log({ err: err, res: "4" })
                                                                    }
                                                                })

                                                                let deleteCanceledSubscriptionQuery = `delete from CanceledSubscription where customerProfileId ='${element.customerProfileId}';`;

                                                                await dbConn.query(deleteCanceledSubscriptionQuery, async (err, result) => {
                                                                    if (err) {
                                                                        console.log({ err: err, res: "4" })
                                                                    }
                                                                })

                                                                let dataObj = {}
                                                                for (let index = 0; index < data.Users[0].Attributes.length; index++) {
                                                                    dataObj = { ...dataObj, [data.Users[0].Attributes[index].Name]: data.Users[0].Attributes[index].Value }
                                                                }

                                                                let emailData = `<html><body>
                                                 <p>CanojaVerify@support</p>
                                                 <p>Hello {{FIRST_NAME}} {{LAST_NAME}},</p>
                                                 <p>Thank you for using CanojaVerify</p>
                                                 <p>We noticed that, as of {{CREATE_DATE}} , new Invoice for your account generated</p>
                                                 <p>Please check your invoice in your account</p>
                                                 <p>Please let us know if you have any additional questions by sending mail to {{CONTACT_EMAIL}} </p>
                                                  </body></html>`;

                                                                let subject = 'Subscription Cancel ';

                                                                let emailQuery = `select * from EmailTemplate where event = 'customer.subscription.deleted'`;

                                                                await dbConn.query(emailQuery, async (err, emailTemplate) => {

                                                                    if (err) {
                                                                        console.log({ err: err })
                                                                    } else {
                                                                        if (emailTemplate && emailTemplate.length > 0) {
                                                                            emailData = emailTemplate[0].html
                                                                            subject = emailTemplate[0].subject
                                                                        }
                                                                    }

                                                                    let deleteRequest = new ApiContracts.DeleteCustomerProfileRequest();
                                                                    deleteRequest.setMerchantAuthentication(merchantAuthenticationType);
                                                                    deleteRequest.setCustomerProfileId(element.customerProfileId);

                                                                    let ctrl = new ApiControllers.DeleteCustomerProfileController(deleteRequest.getJSON());

                                                                    if (process.env.ENV == 'prod') {
                                                                        ctrl.setEnvironment(SDKConstants.endpoint.production);
                                                                    }

                                                                    ctrl.execute(async function () {

                                                                        let deleteCustomerProfileApiResponse = ctrl.getResponse();

                                                                        let deleteCustomerProfileResponse = new ApiContracts.DeleteCustomerProfileResponse(deleteCustomerProfileApiResponse);

                                                                        if (deleteCustomerProfileResponse != null) {
                                                                            if (deleteCustomerProfileResponse.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {

                                                                                const sender = Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
                                                                                const recipient = email;

                                                                                emailData = await templateService.replaceVariables(emailData, dataObj, req, 'subscription', sender)
                                                                                const charset = "UTF-8";

                                                                                const ses = new AWS.SES({
                                                                                    apiVersion: Env['REACT_APP_SES_API_VERSION'],
                                                                                    region: Env['REACT_APP_SES_REGION'],
                                                                                    accessKeyId: Env['REACT_APP_SES_ACCESS_KEY_ID'],
                                                                                    secretAccessKey: Env['REACT_APP_SES_SECRET_ACCESS_KEY'],
                                                                                    endpoint: Env['REACT_APP_SES_ENDPOINT'],
                                                                                });

                                                                                const params = {
                                                                                    Source: sender,
                                                                                    Destination: {
                                                                                        ToAddresses: [
                                                                                            recipient
                                                                                        ],
                                                                                    },
                                                                                    Message: {
                                                                                        Subject: {
                                                                                            Data: subject,
                                                                                            Charset: charset
                                                                                        },
                                                                                        Body: {
                                                                                            Html: {
                                                                                                Charset: "UTF-8",
                                                                                                Data: emailData
                                                                                            },

                                                                                        }
                                                                                    },
                                                                                };
                                                                                console.log("Email params >> ", params)
                                                                                const sendPromise = ses.sendEmail(params).promise();

                                                                                sendPromise.then(
                                                                                    function (resultData) {
                                                                                        console.log({ success: 'post call succeed!', url: req.url, data: resultData })
                                                                                        res.json({ success: 'post call succeed!', url: req.url, data: resultData })
                                                                                    }).catch(
                                                                                        function (err) {
                                                                                            console.log({ err: err, })
                                                                                            res.json({ err: err })
                                                                                        })

                                                                            }
                                                                            else {
                                                                                console.log({ err: deleteCustomerProfileResponse })
                                                                                res.json({ err: deleteCustomerProfileResponse })
                                                                            }
                                                                        }
                                                                        else {
                                                                            console.log({ err: 'Null deleteCustomerProfile response.', data: data })
                                                                            res.json({ err: 'Null deleteCustomerProfile response.', data: data })
                                                                        }
                                                                    });

                                                                })
                                                            } else {

                                                                let cancelRequest = new ApiContracts.ARBCancelSubscriptionRequest();
                                                                cancelRequest.setMerchantAuthentication(merchantAuthenticationType);
                                                                cancelRequest.setSubscriptionId(element.subscriptionId);

                                                                console.log(JSON.stringify(cancelRequest.getJSON(), null, 2));

                                                                let ctrl = new ApiControllers.ARBCancelSubscriptionController(cancelRequest.getJSON());
                                                                if (process.env.ENV == 'prod') {
                                                                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                                                                }
                                                                ctrl.execute(function () {

                                                                    let apiResponse = ctrl.getResponse();

                                                                    let response = new ApiContracts.ARBCancelSubscriptionResponse(apiResponse);

                                                                    console.log(JSON.stringify(response, null, 2));

                                                                    if (response != null) {
                                                                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                                                        }
                                                                        else {
                                                                            res.json({ err: response })
                                                                        }
                                                                    }
                                                                    else {
                                                                        console.log('Null Response.');
                                                                        res.json({ err: 'Null Response.' })
                                                                    }
                                                                });
                                                            }
                                                        } else {
                                                            console.log({ err: 'not data found', result: data })
                                                            res.json({ err: 'not data found', result: data })
                                                        }
                                                    }
                                                })
                                            } else {
                                                console.log({ err: "No user found" })
                                                res.json({ err: "No user found" })

                                            }
                                        }
                                    } else {
                                        console.log('Null response received')
                                        res.json({ err: 'Null response received' })
                                    }
                                })
                            }
                        } else {
                            return res.json({ err: 'Env not found!', url: req.url, body: req.body })
                        }
                    }
                })
            }
        });
    } catch (err) {
        console.log({ err: JSON.stringify(err, null, 2) });
        res.json({ err: JSON.stringify(err, null, 2) });

    }
})

module.exports = route;