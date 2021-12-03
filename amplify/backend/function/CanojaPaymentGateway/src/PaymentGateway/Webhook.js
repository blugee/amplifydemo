

var express = require('express')
const route = express.Router()
var AWS = require('aws-sdk')
const dbConn = require('./config');
var templateService = require('./Service/EmailtemplateService');
var service = require('./Service/generalService');
/**
 * Working
 */

route.post('/paymentgateway/webhook/cancelsubscription', async function (req, res) {
    try {


        let envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET', 'REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL', 'REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT'`


        req.body.customer_profile_id = req.body.payload.profile.customerProfileId
        let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
        let userProfile = response.UserProfileResponse
        let Env = response.Env

        let email = userProfile.profile.email;
        if (email) {
            var params = {
                Filter: `email=\"${email}\"`,
                UserPoolId: Env['REACT_APP_USER_POOL_ID']
            };

            await AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
            var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
            await cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                if (err) {
                    res.json({ err: err, body: req.body, res: "users not found" })
                }
                else {
                    if (data && data.Users.length > 0) {
                        var deleteParams = {
                            Username: data.Users[0].Username,
                            UserPoolId: Env['REACT_APP_USER_POOL_ID']
                        };
                        await cognitoidentityserviceprovider.adminDeleteUser(deleteParams, (err, data1) => {
                            if (err) {
                                res.json({ err: err, body: req.body, res: "2" })
                            }
                        })

                        let deletePendingReportQuery = `delete from PendingReport where username = '${data.Users[0].Username}';  `;

                        await dbConn.query(deletePendingReportQuery, async (err, result) => {
                            if (err) {
                                res.json({ err: err, body: req.body, res: "3" })
                            }
                        })

                        let deletePurchaseReportQuery = `delete from PurchaseReport where username = '${data.Users[0].Username}';  `;

                        await dbConn.query(deletePurchaseReportQuery, async (err, result) => {
                            if (err) {
                                res.json({ err: err, body: req.body, res: "4" })
                            }
                        })

                        let deleteUserQuery = `delete from User where customerProfileId ='${req.body.payload.profile.customerProfileId}';  `;

                        await dbConn.query(deleteUserQuery, async (err, result) => {
                            if (err) {
                                res.json({ err: err, body: req.body, res: "4" })
                            }
                        })

                        let deleteCanceledSubscriptionQuery = `delete from CanceledSubscription where customerProfileId ='${req.body.payload.profile.customerProfileId}';`;

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

                        let emailQuery = `select * from EmailTemplate where event = 'customer.subscription.deleted' `;

                        await dbConn.query(emailQuery, async (err, emailTemplate) => {

                            if (err) {
                                res.json({ err: err, body: req.body })
                            } else {
                                if (emailTemplate && emailTemplate.length > 0) {
                                    emailData = emailTemplate[0].html
                                    subject = emailTemplate[0].subject
                                }
                            }

                            req.body.id = req.body.payload.id
                            req.body.customer_profile_id = req.body.payload.profile.customerProfileId
                            let subscriptionResponse = await service.authorizenetServices(req, res, 'GET_SUBSCRIPTION_BY_ID', envQuery)
                            let deleteCustomerProfileResponse = await service.authorizenetServices(req, res, 'DELETE_CUSTOMER_PROFILE', envQuery)
                            if (deleteCustomerProfileResponse) {
                                req.subscriptionPaymentSchedule = subscriptionResponse.subscription.paymentSchedule;
                                req.subscriptionPaymentSchedule.subscriptionName = subscriptionResponse.subscription.name;
                                req.subscriptionPaymentSchedule.amount = subscriptionResponse.subscription.amount;
                                req.subscriptionPaymentSchedule.startDate = subscriptionResponse.subscription.paymentSchedule.startDate
                                req.subscriptionPaymentSchedule.endDate = "-"

                                const sender = Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
                                const recipient = email;

                                emailData = await templateService.replaceVariables(emailData, dataObj, req, 'subscription', Env['REACT_APP_CONTACT_COMPANY_EMAIL'])
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

                                const sendPromise = ses.sendEmail(params).promise();

                                sendPromise.then(
                                    function (resultData) {
                                        console.log("resultData", resultData)
                                        res.json({ success: 'post call succeed!', url: req.url, body: req.body, data: resultData, customer: customer })
                                    }).catch(
                                        function (err) {
                                            res.json({ err: err, body: req.body, })

                                        })
                            }
                        })
                    } else {
                        res.json({ err: 'not data found', body: req.body, res: "6", result: data })
                    }
                }
            })
        } else {
            res.json({ err: 'Customer not found', body: req.body, customer: userProfile })
        }
    } catch (error) {
        res.json({ err: error, body: req.body })
    }
});

/**
 * working
 */
route.post('/paymentgateway/webhook/createInvoice', async function (req, res) {
    try {
        if (req.body && req.body.payload) {


            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
            req.body.transactionId = req.body.payload.id
            let transactionDetailsResponse = await service.authorizenetServices(req, res, 'GET_TRANSACTION_BY_ID', envQuery);

            req.transactionDetails = transactionDetailsResponse.transaction
            req.transactionDetails.invoiceNo = transactionDetailsResponse.transaction.order.invoiceNumber;
            req.transactionDetails.transactionType = transactionDetailsResponse.transaction.transactionType;
            req.transactionDetails.transactionId = transactionDetailsResponse.transaction.transId;

            let customerProfile = transactionDetailsResponse.transaction.profile;
            req.body.customer_profile_id = customerProfile.customerProfileId

            envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT'`

            let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
            let email = response.UserProfileResponse.profile.email
            let Env = response.Env

            if (email) {
                let params = {
                    Filter: `email=\"${email}\"`,
                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                };
                await AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                await cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                    if (err) {
                        res.json({ err: err, body: req.body, res: "users not found" })
                    }
                    else {
                        if (data && data.Users.length > 0) {
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

                            let subject = 'Invoice created';

                            let emailQuery = `select * from EmailTemplate where event = 'invoice.created' `;

                            await dbConn.query(emailQuery, async (err, emailTemplate) => {

                                if (err) {
                                    res.json({ err: err, body: req.body })
                                } else {
                                    if (emailTemplate && emailTemplate.length > 0) {
                                        emailData = emailTemplate[0].html
                                        subject = emailTemplate[0].subject
                                    }
                                }

                                const sender = Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
                                const recipient = email;

                                emailData = await templateService.replaceVariables(emailData, dataObj, req, 'invoice', sender)

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

                                const sendPromise = ses.sendEmail(params).promise();

                                sendPromise.then(
                                    function (resultData) {
                                        console.log("resultData", resultData)
                                        res.json({ success: 'post call succeed!', data: resultData })
                                    }).catch(
                                        function (err) {
                                            res.json({ err: err, body: req.body, })
                                        })
                            })
                        } else {
                            res.json({ err: 'user not found', body: req.body, data: data })
                        }
                    }
                })
            }
        }
    } catch (error) {
        res.json({ err: error, body: req.body });
    }
});

/**
 * Working
 */

route.post('/paymentgateway/webhook/paymentFailedInvoice', async function (req, res) {
    console.log('/paymentgateway/webhook/paymentFailedInvoice >> ' + JSON.stringify(req.body, null, 2))
    try {
        if (req.body && req.body.payload) {

            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
            req.body.transactionId = req.body.payload.id
            let transactionDetailsResponse = await service.authorizenetServices(req, res, 'GET_TRANSACTION_BY_ID', envQuery);

            req.transactionDetails = transactionDetailsResponse.transaction
            req.transactionDetails.invoiceNo = transactionDetailsResponse.transaction.order.invoiceNumber;
            req.transactionDetails.transactionType = transactionDetailsResponse.transaction.transactionType;
            req.transactionDetails.transactionId = transactionDetailsResponse.transaction.transId;

            let customerProfile = transactionDetailsResponse.transaction.profile;
            req.body.customer_profile_id = customerProfile.customerProfileId

            envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT'`

            let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
            let email = response.UserProfileResponse.profile.email
            let Env = response.Env

            if (email) {
                var params = {
                    Filter: `email=\"${email}\"`,
                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                };


                await AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                await cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                    if (err) {
                        res.json({ err: err, body: req.body, res: "users not found" })
                    }
                    else {
                        if (data && data.Users.length > 0) {
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

                            let subject = 'Payment failed Invoice ';

                            let emailQuery = `select * from EmailTemplate where event = 'invoice.payment_failed' `;

                            await dbConn.query(emailQuery, async (err, emailTemplate) => {

                                if (err) {
                                    res.json({ err: err, body: req.body })
                                } else {
                                    if (emailTemplate && emailTemplate.length > 0) {
                                        emailData = emailTemplate[0].html
                                        subject = emailTemplate[0].subject
                                    }
                                }


                                const sender = Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
                                const recipient = email;
                                const charset = "UTF-8";

                                emailData = await templateService.replaceVariables(emailData, dataObj, req, 'invoice', sender)

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

                                const sendPromise = ses.sendEmail(params).promise();

                                sendPromise.then(
                                    function (resultData) {
                                        console.log("resultData", resultData)
                                        res.json({ success: 'post call succeed!', url: req.url, body: req.body, data: resultData, customer: customerProfileResponse })
                                    }).catch(
                                        function (err) {
                                            res.json({ err: err, body: req.body, })

                                        })
                            })
                        } else {
                            res.json({ err: 'user not found', body: req.body, data: data })
                        }
                    }
                })
            } else {
                res.json({ err: 'Customer not found', body: req.body, })
            }
        }
    } catch (error) {
        res.json({ err: error, body: req.body });
    }
});

/**
 * Working
 */

route.post('/paymentgateway/webhook/paymentPaidInvoice', async function (req, res) {
    console.log('/paymentgateway/webhook/createInvoice >> ' + JSON.stringify(req.body, null, 2))
    try {
        if (req.body && req.body.payload) {

            let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
            req.body.transactionId = req.body.payload.id
            let transactionDetailsResponse = await service.authorizenetServices(req, res, 'GET_TRANSACTION_BY_ID', envQuery);

            req.transactionDetails = transactionDetailsResponse.transaction
            req.transactionDetails.invoiceNo = transactionDetailsResponse.transaction.order.invoiceNumber;
            req.transactionDetails.transactionType = transactionDetailsResponse.transaction.transactionType;
            req.transactionDetails.transactionId = transactionDetailsResponse.transaction.transId;

            let customerProfile = transactionDetailsResponse.transaction.profile;
            req.body.customer_profile_id = customerProfile.customerProfileId

            envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT'`

            let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
            let email = response.UserProfileResponse.profile.email
            let Env = response.Env

            if (email) {
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

                            let subject = 'paid Invoice ';

                            let emailQuery = `select * from EmailTemplate where event = 'invoice.paid'  `;

                            await dbConn.query(emailQuery, async (err, emailTemplate) => {

                                if (err) {
                                    return res.json({ err: err, body: req.body })
                                } else {
                                    if (emailTemplate && emailTemplate.length > 0) {
                                        emailData = emailTemplate[0].html
                                        subject = emailTemplate[0].subject
                                    }
                                }

                                const sender = Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
                                const recipient = email;

                                emailData = await templateService.replaceVariables(emailData, dataObj, req, 'invoice', sender);

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

                                const sendPromise = ses.sendEmail(params).promise();

                                sendPromise.then(
                                    function (resultData) {
                                        console.log("resultData", resultData)
                                        return res.json({ success: 'post call succeed!', url: req.url, body: req.body, data: resultData, customer: customer })
                                    }).catch(
                                        function (err) {
                                            return res.json({ err: err, body: req.body, })
                                        })
                            })
                        } else {
                            return res.json({ err: 'user not found', body: req.body, data: data })
                        }
                    }
                })
            } else {
                return res.json({ err: 'Customer not found', body: req.body, })
            }
        }
    } catch (error) {
        return res.json({ err: error, body: req.body });
    }
});

/**
 * Working
 */
route.post('/paymentgateway/webhook/createSubscription', async function (req, res) {

    if (req.body.payload && req.body.payload.profile && req.body.payload.profile.customerProfileId) {
        try {
            req.body.customer_profile_id = req.body.payload.profile.customerProfileId

            let envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT'`

            let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
            let email = response.UserProfileResponse.profile.email
            let Env = response.Env

            if (email) {
                var params = {
                    Filter: `email=\"${email}\"`,
                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                };
                AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                    if (err) {
                        res.json({ err: err, body: req.body, res: "users not found" })
                    }
                    else {
                        if (data && data.Users.length > 0) {
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

                            let subject = 'subscription created';

                            let emailQuery = `select * from EmailTemplate where event = 'customer.subscription.created' `;

                            dbConn.query(emailQuery, async (err, emailTemplate) => {

                                if (err) {
                                    res.json({ err: err, body: req.body })
                                } else {
                                    if (emailTemplate && emailTemplate.length > 0) {
                                        emailData = emailTemplate[0].html
                                        subject = emailTemplate[0].subject
                                    }
                                }
                                envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
                                req.body.id = req.body.payload.id
                                let subscriptionResponse = await service.authorizenetServices(req, res, 'GET_SUBSCRIPTION_BY_ID', envQuery)

                                req.subscriptionPaymentSchedule = subscriptionResponse.subscription.paymentSchedule;
                                req.subscriptionPaymentSchedule.subscriptionName = subscriptionResponse.subscription.name;
                                req.subscriptionPaymentSchedule.amount = subscriptionResponse.subscription.amount;
                                req.subscriptionPaymentSchedule.startDate = subscriptionResponse.subscription.paymentSchedule.startDate
                                req.subscriptionPaymentSchedule.endDate = "-"

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
                                            }
                                        }
                                    },
                                };
                                console.log('params', params)

                                const sendPromise = ses.sendEmail(params).promise();

                                sendPromise.then(
                                    function (resultData) {
                                        console.log("resultData", resultData)
                                        res.json({ success: 'post call succeed!', url: req.url, body: req.body, data: resultData, customer: customer })
                                    }).catch(
                                        function (err) {
                                            res.json({ err: err, body: req.body, })

                                        })
                            })
                        } else {
                            res.json({ err: 'user not found', body: req.body, data: data })
                        }
                    }
                })
            } else {
                res.json({ err: 'Customer not found', body: req.body })
            }
        } catch (error) {
            res.json({ err: error, body: req.body })
        }
    }
});

/**
 * Working
 */
route.post('/paymentgateway/webhook/updateSubscription', async function (req, res) {

    if (req.body.payload && req.body.payload.profile && req.body.payload.profile.customerProfileId) {
        try {
            req.body.customer_profile_id = req.body.payload.profile.customerProfileId

            let envQuery = `'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT'`

            let response = await service.authorizenetServices(req, res, 'GET_CUSTOMER_PROFILE', envQuery)
            let email = response.UserProfileResponse.profile.email
            let Env = response.Env

            if (email) {
                var params = {
                    Filter: `email=\"${email}\"`,
                    UserPoolId: Env['REACT_APP_USER_POOL_ID']
                };
                AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                    if (err) {
                        res.json({ err: err, body: req.body, res: "users not found", res: 2 })
                    }
                    else {
                        if (data && data.Users.length > 0) {
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

                            let subject = 'subscription updated ';

                            let emailQuery = `select * from EmailTemplate where event = 'customer.subscription.updated' `;

                            dbConn.query(emailQuery, async (err, emailTemplate) => {

                                if (err) {
                                    res.json({ err: err, body: req.body, res: 3 })
                                } else {
                                    if (emailTemplate && emailTemplate.length > 0) {
                                        emailData = emailTemplate[0].html
                                        subject = emailTemplate[0].subject
                                    }
                                }

                                envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
                                req.body.id = req.body.payload.id
                                let subscriptionResponse = await service.authorizenetServices(req, res, 'GET_SUBSCRIPTION_BY_ID', envQuery)

                                req.subscriptionPaymentSchedule = subscriptionResponse.subscription.paymentSchedule;
                                req.subscriptionPaymentSchedule.subscriptionName = subscriptionResponse.subscription.name;
                                req.subscriptionPaymentSchedule.amount = subscriptionResponse.subscription.amount;
                                req.subscriptionPaymentSchedule.startDate = subscriptionResponse.subscription.paymentSchedule.startDate
                                req.subscriptionPaymentSchedule.endDate = "-"

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
                                console.log('Env', Env);

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
                                console.log('params', params)

                                const sendPromise = ses.sendEmail(params).promise();

                                sendPromise.then(
                                    function (resultData) {
                                        console.log("resultData", resultData)
                                        res.json({ success: 'post call succeed!', url: req.url, body: req.body, data: resultData, customer: customer })
                                    }).catch(
                                        function (err) {
                                            console.log({ err: err, body: req.body, res: 4 });
                                            res.json({ err: err, body: req.body, res: 4 })
                                        })
                            })
                        } else {
                            console.log({ err: 'user not found', body: req.body, data: data, res: 7 });
                            res.json({ err: 'user not found', body: req.body, data: data, res: 7 })
                        }
                    }
                })
            } else {
                console.log({ err: 'Customer not found', body: req.body, res: 8 });
                res.json({ err: 'Customer not found', body: req.body, res: 8 })
            }
        } catch (error) {
            console.log({ err: error, body: req.body, res: 11 });
            res.json({ err: error, body: req.body, res: 11 })
        }
    } else {
        res.json({ err: "No data found!", body: req.body, res: 12 })
    }
});

module.exports = route
