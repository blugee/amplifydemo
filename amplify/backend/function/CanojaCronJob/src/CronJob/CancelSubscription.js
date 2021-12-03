const dbConn = require('./config');
var AWS = require('aws-sdk')
var templateService = require('./Service/EmailtemplateService')
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;


const CancelSubscription = async function () {
    try {
        console.log('CancelSubscription Call');
        let cronJobStart = "UPDATE CronJob set isRunning = 'true', result = NULL WHERE name = 'CANCEL_SUBSCRIPTION_CRONJOB';"
        dbConn.query(cronJobStart, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 1 });
            }

            let subscriptionQuery = `SELECT * FROM CanceledSubscription where isCancelApplied = 'true' AND isCanceled = 'false';`
            dbConn.query(subscriptionQuery, (err, subscription) => {
                if (err) {
                    console.log({ err: JSON.stringify(err, null, 2), res: 1 });
                } else {
                    let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL','REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT', 'REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY');`
                    let Env = {}
                    console.log("subscription >>", subscription);
                    dbConn.query(envQuery, async (err, envVariable) => {
                        if (err) {
                            console.log({ err: JSON.stringify(err, null, 2), res: 2 });
                        } else {
                            if (envVariable && envVariable.length > 0) {
                                for (let i = 0; i < envVariable.length; i++) {
                                    Env[envVariable[i].name] = envVariable[i].value
                                }
                                subscription.forEach(element => {
                                    let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

                                    merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                                    merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])

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
                                                if (email) {
                                                    let params = {
                                                        Filter: `email=\"${email}\"`,
                                                        UserPoolId: Env['REACT_APP_USER_POOL_ID']
                                                    };

                                                    await AWS.config.update({ region: Env['REACT_APP_REGION'], 'accessKeyId': Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': Env['REACT_APP_SECRET_ACCESS_KEY'] });
                                                    let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
                                                    await cognitoidentityserviceprovider.listUsers(params, async (err, data) => {
                                                        if (err) {
                                                            console.log({ err: JSON.stringify(err, null, 2), res: 3 });
                                                        }
                                                        else {
                                                            if (data && data.Users.length > 0) {
                                                                // Check For Basic Subscription
                                                                let matchStr = /BASIC_/;
                                                                if (matchStr.test(element.subscriptionId)) {

                                                                    let deleteCanceledSubscriptionQuery = `delete from CanceledSubscription where customerProfileId ='${element.customerProfileId}';`;

                                                                    await dbConn.query(deleteCanceledSubscriptionQuery, async (err, result) => {
                                                                        if (err) {
                                                                            console.log({ err: JSON.stringify(err, null, 2), res: 4 });
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
                                                                            console.log({ err: err, res: 5 })
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
                                                                                    let req = {}
                                                                                    req.subscriptionPaymentSchedule = {
                                                                                        subscriptionName: 'BASIC',
                                                                                        totalOccurrences: 9999,
                                                                                        amount: 0,
                                                                                        interval: {
                                                                                            length: 1,
                                                                                            unit: 'month'
                                                                                        }
                                                                                    }

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
                                                                                    const sendPromise = ses.sendEmail(params).promise();

                                                                                    sendPromise.then(
                                                                                        function (resultData) {
                                                                                            console.log({ success: 'post call succeed!', data: resultData, res: 6 })
                                                                                        }).catch(
                                                                                            function (err) {
                                                                                                console.log({ err: err, res: 7 })
                                                                                            })
                                                                                }
                                                                                else {
                                                                                    console.log({ err: deleteCustomerProfileResponse, res: 8 })
                                                                                }
                                                                            }
                                                                            else {
                                                                                console.log({ err: 'Null deleteCustomerProfile response.', data: data, res: 9 })
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
                                                                    ctrl.execute(async function () {

                                                                        let apiResponse = ctrl.getResponse();

                                                                        let response = new ApiContracts.ARBCancelSubscriptionResponse(apiResponse);

                                                                        console.log(JSON.stringify(response, null, 2));

                                                                        if (response != null) {
                                                                            if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                                                                let deleteCanceledSubscriptionQuery = `delete from CanceledSubscription where customerProfileId ='${element.customerProfileId}';`;

                                                                                dbConn.query(deleteCanceledSubscriptionQuery, async (err, result) => {
                                                                                    if (err) {
                                                                                        console.log({ err: JSON.stringify(err, null, 2), res: 11 });
                                                                                    }
                                                                                    console.log({ success: 'Message Code : ' + response.getMessages().getMessage()[0].getCode(), res: 10 });
                                                                                    console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
                                                                                })
                                                                            }
                                                                            else {
                                                                                console.log({ err: 'Result Code: ' + response.getMessages().getResultCode(), res: 12 });
                                                                                console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                                                                                console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                                                                            }
                                                                        }
                                                                        else {
                                                                            console.log({ err: 'Null Response.', res: 13 });
                                                                        }
                                                                    });
                                                                }
                                                            } else {
                                                                console.log({ err: 'not data found', result: data, res: 14 })
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    console.log({ err: "No user found", res: 15 })
                                                }
                                            }
                                        } else {
                                            console.log({ err: "No user found", res: 16 })
                                        }
                                    })

                                })
                                let cronJobFinish = "UPDATE CronJob set isRunning = 'false', result = 'Success' WHERE name = 'CANCEL_SUBSCRIPTION_CRONJOB';"
                                dbConn.query(cronJobFinish, (err, data) => {
                                    if (err) {
                                        console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                    }
                                })
                            }
                        }
                    })
                }
            });
        })
    } catch (err) {
        let cronJobStart = `UPDATE CronJob set isRunning = 'false',  result = error ${err} WHERE name = 'CANCEL_SUBSCRIPTION_CRONJOB';`
        dbConn.query(cronJobStart, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 11 });
            }
        })
        console.log({ err: JSON.stringify(err, null, 2), res: 16 });
    }
}
let Crons = {
    CancelSubscription
}
module.exports = Crons