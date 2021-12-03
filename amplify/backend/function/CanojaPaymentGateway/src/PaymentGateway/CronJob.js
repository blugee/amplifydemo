var cron = require('node-cron');
const dbConn = require('./config');
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var AWS = require('aws-sdk')
var moment = require('moment');
var templateService = require('./Service/EmailtemplateService')
var SDKConstants = require('authorizenet').Constants;


const Charges = () => {
    console.log('cronjob Call')
    cron.schedule('0 23 * * *', () => {
        console.log("Sample Cron Job")
    }, {
        scheduled: true,
        timezone: "America/New_York"
    })

    cron.schedule('0 23 28 * *', () => {
        console.log('Running a job CancelSubscription at 23:00 on every months 28 at America/New_York timezone');
        ChargesApi()
    }, {
        scheduled: true,
        timezone: "America/New_York"
    });
}

const CancelSubscription = () => {
    console.log('CancelSubscription');
    cron.schedule('0 23 28 * *', () => {
        console.log('Running a job CancelSubscription at 23:00 on every months 28 at America/New_York timezone');
        CancelSubscriptionApi();
    }, {
        scheduled: true,
        timezone: "America/New_York"
    });
}

const ChargesApi = () => {
    console.log('ChargesApi Function Call')

    let cronJobStart = "UPDATE CronJob set isRunning = 'true', result = NULL WHERE name = 'CHARGES_CRONJOB';"
    dbConn.query(cronJobStart, (err, data) => {
        if (err) {
            console.log({ err: err, msg: 'Cronjob Error', res: 1 });
        }
    })
    let date = moment().format("MM-DD-YYYY")
    try {
        console.log('ChargesCronjob Call');

        let distinctQuery = `SELECT DISTINCT customerProfileId, customerPaymentProfileId FROM Charge where isBilled = 'false';`
        dbConn.query(distinctQuery, (err, userIds) => {
            if (err) {
                console.log({ err: JSON.stringify(err, null, 2), res: 1 });
            } else {
                console.log('userIds >>', userIds)
                let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
                let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET');`
                let Env = {}
                dbConn.query(envQuery, async (err, envVariable) => {
                    if (err) {
                        console.log({ err: err, res: 1.1 })
                    } else {
                        if (envVariable && envVariable.length == 2) {
                            for (let i = 0; i < envVariable.length; i++) {
                                Env[envVariable[i].name] = envVariable[i].value
                            }
                            console.log('Env >>', Env)

                            merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                            merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])

                            userIds.forEach(element => {

                                let chargeQuery = `select * from Charge where customerProfileId  = '${element.customerProfileId}' AND isBilled = 'false';`
                                dbConn.query(chargeQuery, (err, data) => {
                                    if (err) {
                                        console.log({ err: JSON.stringify(err, null, 2), res: 2 });
                                    } else {
                                        if (data && data.length > 0) {

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
                                                let userCredit = (obj.pricePerUnit * obj.noOfRecordsFetch) - obj.chargeAmount
                                                let lineItem_id = new ApiContracts.LineItemType();
                                                lineItem_id.setItemId(a + 1);
                                                lineItem_id.setName(obj.productName);
                                                lineItem_id.setDescription(`${obj.description} (Discount $${userCredit.toFixed(2)}(USD))`);
                                                lineItem_id.setDiscountAmount(userCredit)
                                                lineItem_id.setQuantity(obj.noOfRecordsFetch);
                                                lineItem_id.setUnitPrice(obj.pricePerUnit);

                                                lineItemList.push(lineItem_id);
                                                amount.push(obj.chargeAmount);
                                                ids.push(obj.id);
                                            }
                                            let idArray = ''
                                            console.log("lineItemList >> ", lineItemList);
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
                                                console.log("Transaction response >> ", JSON.stringify(response, null, 2));
                                                if (response != null) {
                                                    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                                        if (response.getTransactionResponse().getMessages() != null) {
                                                            let updateChargeQuery = `UPDATE Charge SET isBilled = 'true' WHERE id IN (${idArray});`
                                                            dbConn.query(updateChargeQuery, (err, updateData) => {
                                                                if (err) {
                                                                    console.log({ err: JSON.stringify(err, null, 2), res: 3 });
                                                                }
                                                            })
                                                            let deleteLogQuery = `DELETE cronLogs WHERE cronJob = 'CHARGES_CRONJOB' AND customerProfileId = ${element.customerProfileId});`
                                                            dbConn.query(deleteLogQuery, (err, deleteData) => {
                                                                if (err) {
                                                                    console.log({ err: JSON.stringify(err, null, 2), res: 3 });
                                                                }
                                                            })
                                                            console.log({ success: `Charges cleared for user customerProfileId: ${element.customerProfileId}`, url: "req.url", charge: response, Price: data })
                                                        }
                                                        else {
                                                            if (response.getTransactionResponse().getErrors() != null) {
                                                                let message = response.getMessages().getMessage()[0].getCode() + " " + response.getMessages().getMessage()[0].getText()
                                                                let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CHARGES_CRONJOB', 'error', '${message} for user customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                                dbConn.query(cronLog, (err, data) => {
                                                                    if (err) {
                                                                        console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                                    }
                                                                })
                                                                console.log({ err: JSON.stringify(response, null, 2), res: 4 });
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                                                            let message = response.getMessages().getMessage()[0].getCode() + " " + response.getMessages().getMessage()[0].getText()
                                                            let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CHARGES_CRONJOB', 'error', '${message} for user customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                            dbConn.query(cronLog, (err, data) => {
                                                                if (err) {
                                                                    console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                                }
                                                            })
                                                            console.log({ err: JSON.stringify(response, null, 2), res: 5 });
                                                        }
                                                        else {
                                                            let message = response.getMessages().getMessage()[0].getCode() + " " + response.getMessages().getMessage()[0].getText()
                                                            let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CHARGES_CRONJOB', 'error', '${message} for user customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                            dbConn.query(cronLog, (err, data) => {
                                                                if (err) {
                                                                    console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                                }
                                                            })
                                                            console.log({ err: JSON.stringify(response, null, 2), res: 6 });
                                                        }
                                                    }
                                                }
                                                else {
                                                    let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CHARGES_CRONJOB', 'error', 'Null Response in transaction for user customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                    dbConn.query(cronLog, (err, data) => {
                                                        if (err) {
                                                            console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                        }
                                                    })
                                                    console.log({ err: "Null Response in transaction.", res: 7 });
                                                }
                                            });
                                        }
                                    }
                                })
                            });
                            let cronJobStart = "UPDATE CronJob set isRunning = 'false', result = 'Success' WHERE name = 'CHARGES_CRONJOB';"
                            dbConn.query(cronJobStart, (err, data) => {
                                if (err) {
                                    console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                }
                            })
                        } else {
                            console.log({ err: 'Env not found!', url: req.url, body: req.body })
                        }
                    }
                })
            }
        });
    } catch (err) {
        let cronJobStart = `UPDATE CronJob set isRunning = 'false',  result = error ${JSON.stringify(err)}   WHERE name = 'CHARGES_CRONJOB';`
        dbConn.query(cronJobStart, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 1 });
            }
        })

        let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CHARGES_CRONJOB', 'error', '${JSON.stringify(err)}', ${date}, NULL);`
        dbConn.query(cronLog, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 1 });
            }
        })
        console.log({ err: JSON.stringify(err, null, 2), res: 8 });
    }

}


const CancelSubscriptionApi = () => {

    let cronJobStart = "UPDATE CronJob set isRunning = 'true', result = NULL WHERE name = 'CANCEL_SUBSCRIPTION_CRONJOB';"
    dbConn.query(cronJobStart, (err, data) => {
        if (err) {
            console.log({ err: err, msg: 'Cronjob Error', res: 1 });
        }
    })
    let date = moment().format("MM-DD-YYYY")

    try {
        console.log('CancelSubscription Call');

        let subscriptionQuery = `SELECT * FROM CanceledSubscription where isCancelApplied = 'true' AND isCanceled = 'false';`
        dbConn.query(subscriptionQuery, (err, subscription) => {
            if (err) {
                console.log({ err: JSON.stringify(err, null, 2), res: 1 });
            } else {
                let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_USER_POOL_ID', 'REACT_APP_REGION', 'REACT_APP_ACCESS_KEY_ID', 'REACT_APP_SECRET_ACCESS_KEY', 'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET', 'REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET', 'REACT_APP_CONTACT_COMPANY_EMAIL', 'REACT_APP_SES_API_VERSION', 'REACT_APP_SES_REGION', 'REACT_APP_SES_ACCESS_KEY_ID', 'REACT_APP_SES_SECRET_ACCESS_KEY', 'REACT_APP_SES_ENDPOINT');`
                let Env = {}
                console.log("subscription >>", subscription);
                dbConn.query(envQuery, async (err, envVariable) => {
                    if (err) {
                        console.log({ err: JSON.stringify(err, null, 2), res: 2 });
                    } else {
                        if (envVariable && envVariable.length == 8) {
                            for (let i = 0; i < envVariable.length; i++) {
                                Env[envVariable[i].name] = envVariable[i].value
                            }
                            let emailData = `<html><body>
                            <p>CanojaVerify@support</p>
                            <p>Hello {{FIRST_NAME}} {{LAST_NAME}},</p>
                            <p>Thank you for using CanojaVerify</p>
                            <p>We noticed that, as of {{CREATE_DATE}} , new Invoice for your account generated</p>
                            <p>Please check your invoice in your account</p>
                            <p>Please let us know if you have any additional questions by sending mail to {{CONTACT_EMAIL}} </p>
                            </body></html>`;

                            let subject = 'Subscription Cancel';

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
                                subscription.forEach(element => {
                                    let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();

                                    merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                                    merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])
                                    let matchStr = /BASIC_/;
                                    if (matchStr.test(element.subscriptionId)) {
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


                                                                    const sender = Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
                                                                    const recipient = email;
                                                                    let req = {}
                                                                    req.subscriptionPaymentSchedule = {
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
                                                                            let deleteLogQuery = `DELETE cronLogs WHERE cronJob = 'CANCEL_SUBSCRIPTION_CRONJOB' AND customerProfileId = ${element.customerProfileId});`
                                                                            dbConn.query(deleteLogQuery, (err, deleteData) => {
                                                                                if (err) {
                                                                                    console.log({ err: JSON.stringify(err, null, 2), res: 3 });
                                                                                }
                                                                            })
                                                                            console.log({ success: 'post call succeed!', data: resultData, res: 6 })
                                                                        }).catch(
                                                                            function (err) {
                                                                                let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', 'error in email send for user customerProfileId: ${element.customerProfileId}, ${JSON.stringify(err)}', ${date}, ${element.customerProfileId});`
                                                                                dbConn.query(cronLog, (err, data) => {
                                                                                    if (err) {
                                                                                        console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                                                    }
                                                                                })
                                                                                console.log({ err: err, res: 7 })
                                                                            })


                                                                } else {
                                                                    let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', 'No user found for email: ${email} in Cogntito', ${date}, ${element.customerProfileId});`
                                                                    dbConn.query(cronLog, (err, data) => {
                                                                        if (err) {
                                                                            console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                                        }
                                                                    })
                                                                    console.log({ err: 'not data found', result: data, res: 14 })
                                                                }
                                                            }
                                                        })
                                                    } else {
                                                        let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', 'Null Response in user profile for customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                        dbConn.query(cronLog, (err, data) => {
                                                            if (err) {
                                                                console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                            }
                                                        })
                                                        console.log({ err: "No user found", res: 15 })
                                                    }
                                                }
                                                else {
                                                    let message = response.getMessages().getMessage()[0].getCode() + " " + response.getMessages().getMessage()[0].getText()

                                                    let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', '${message} for customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                    dbConn.query(cronLog, (err, data) => {
                                                        if (err) {
                                                            console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                        }
                                                    })
                                                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                                                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                                                }
                                            } else {
                                                let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', 'No user found for customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                dbConn.query(cronLog, (err, data) => {
                                                    if (err) {
                                                        console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                    }
                                                })
                                                console.log({ err: "No user found", res: 16 })
                                            }
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
                                                    let deleteCanceledSubscriptionQuery = `delete from CanceledSubscription where customerProfileId ='${element.customerProfileId}';`;

                                                    dbConn.query(deleteCanceledSubscriptionQuery, async (err, result) => {
                                                        if (err) {
                                                            console.log({ err: JSON.stringify(err, null, 2), res: 11 });
                                                        }
                                                        let deleteLogQuery = `DELETE cronLogs WHERE cronJob = 'CANCEL_SUBSCRIPTION_CRONJOB' AND customerProfileId = ${element.customerProfileId});`
                                                        dbConn.query(deleteLogQuery, (err, deleteData) => {
                                                            if (err) {
                                                                console.log({ err: JSON.stringify(err, null, 2), res: 3 });
                                                            }
                                                        })
                                                        console.log({ success: 'Message Code : ' + response.getMessages().getMessage()[0].getCode(), res: 10 });
                                                        console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
                                                    })
                                                }
                                                else {
                                                    let message = response.getMessages().getMessage()[0].getCode() + " " + response.getMessages().getMessage()[0].getText()
                                                    let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', '${message} for customerProfileId: ${element.customerProfileId}', ${date}, ${element.customerProfileId});`
                                                    dbConn.query(cronLog, (err, data) => {
                                                        if (err) {
                                                            console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                        }
                                                    })
                                                    console.log({ err: 'Result Code: ' + response.getMessages().getResultCode(), res: 12 });
                                                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                                                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                                                }
                                            }
                                            else {
                                                let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', 'Null Response for customerProfileId: ${element.customerProfileId} from authorize.net', ${date}, ${element.customerProfileId});`
                                                dbConn.query(cronLog, (err, data) => {
                                                    if (err) {
                                                        console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                                    }
                                                })
                                                console.log({ err: 'Null Response.', res: 13 });
                                            }
                                        });
                                    }
                                })
                            })

                            let cronJobStart = "UPDATE CronJob set isRunning = 'false', result= 'success' WHERE name = 'CANCEL_SUBSCRIPTION_CRONJOB';"
                            dbConn.query(cronJobStart, (err, data) => {
                                if (err) {
                                    console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                }
                            })
                        } else {
                            let cronLog = `Insert cronLogs (cronJob, code, message, date, customerProfileId) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', 'Required envs not found', ${date}, ${element.customerProfileId});`
                            dbConn.query(cronLog, (err, data) => {
                                if (err) {
                                    console.log({ err: err, msg: 'Cronjob Error', res: 1 });
                                }
                            })
                            console.log({ err: 'Env not found!', url: req.url, body: req.body })
                        }
                    }
                })
            }
        });
    } catch (err) {
        let cronJobStart = `UPDATE CronJob set isRunning = 'false', result = error ${err} WHERE name = 'CANCEL_SUBSCRIPTION_CRONJOB';`
        dbConn.query(cronJobStart, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 1 });
            }
        })

        let cronLog = `Insert cronLogs (cronJob, code, message, date) VALUES ('CANCEL_SUBSCRIPTION_CRONJOB', 'error', '${JSON.stringify(err)}', ${date});`
        dbConn.query(cronLog, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 1 });
            }
        })
        console.log({ err: JSON.stringify(err, null, 2), res: 16 });
    }
}

const CronJob = {
    Charges,
    CancelSubscription,
    ChargesApi,
    CancelSubscriptionApi
}

module.exports = CronJob