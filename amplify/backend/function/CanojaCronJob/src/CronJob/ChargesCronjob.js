const dbConn = require('./config');
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;

const ChargesCronjob = async function () {
    try {
        console.log('Running a Function ChargesCron');
        let cronJobStart = "UPDATE CronJob set isRunning = 'true', result = NULL WHERE name = 'CHARGES_CRONJOB';"
        dbConn.query(cronJobStart, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 1 });
            }
            let distinctQuery = `SELECT DISTINCT customerProfileId, customerPaymentProfileId FROM Charge where isBilled = 'false';`
            dbConn.query(distinctQuery, (err, userIds) => {
                if (err) {
                    console.log({ err: JSON.stringify(err, null, 2), res: 2 });
                } else {
                    console.log('userIds >>', userIds)
                    let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET');`
                    let Env = {}
                    dbConn.query(envQuery, async (err, envVariable) => {
                        if (err) {
                            console.log({ err: err, res: 3 })
                        } else {
                            if (envVariable && envVariable.length > 0) {
                                for (let i = 0; i < envVariable.length; i++) {
                                    Env[envVariable[i].name] = envVariable[i].value
                                }
                                console.log('Env >>', Env)
                                let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
                                merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                                merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])

                                userIds.forEach(element => {

                                    let chargeQuery = `select * from Charge where customerProfileId  = '${element.customerProfileId}' AND isBilled = 'false';`
                                    dbConn.query(chargeQuery, (err, data) => {
                                        if (err) {
                                            console.log({ err: JSON.stringify(err, null, 2), res: 4 });
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
                                                let ids = [];

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

                                                console.log('ids >> ', ids)
                                                let idArray = ''
                                                if (ids.length > 0) {
                                                    for (let i = 0; i < ids.length; i++) {
                                                        const element = ids[i]
                                                        if (ids.length - 1 === i) {
                                                            idArray += `'${element}'`
                                                        } else {
                                                            idArray += `'${element}',`
                                                        }
                                                    }
                                                    console.log('idArray >> ', idArray)
                                                }

                                                console.log("lineItemList >> ", lineItemList);
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

                                                ctrl.execute(function () {

                                                    let apiResponse = ctrl.getResponse();

                                                    let response = new ApiContracts.CreateTransactionResponse(apiResponse);
                                                    console.log("Transaction response >> ", JSON.stringify(response, null, 2));
                                                    if (response != null) {
                                                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                                                            if (response.getTransactionResponse().getMessages() != null) {
                                                                let updateChargeQuery = `UPDATE Charge SET isBilled = 'true' WHERE id IN (${idArray});`

                                                                console.log('updateChargeQuery >>', updateChargeQuery)

                                                                dbConn.query(updateChargeQuery, (err, updateData) => {
                                                                    if (err) {
                                                                        console.log({ err: JSON.stringify(err, null, 2), res: 9 });
                                                                    }
                                                                })
                                                                console.log({ success: `Charges cleared for user customerProfileId: ${element.customerProfileId}`, url: "req.url", charge: response, Price: data })
                                                            }
                                                            else {
                                                                if (response.getTransactionResponse().getErrors() != null) {
                                                                    console.log({ err: JSON.stringify(response, null, 2), res: 5 });
                                                                }
                                                            }
                                                        }
                                                        else {
                                                            if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                                                                console.log({ err: JSON.stringify(response, null, 2), res: 6 });
                                                            }
                                                            else {
                                                                console.log({ err: JSON.stringify(response, null, 2), res: 7 });
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        console.log({ err: "Null Response in transaction.", res: 8 });
                                                    }
                                                });
                                            }
                                        }
                                    })
                                });

                                let cronJobStart = "UPDATE CronJob set isRunning = 'false', result = 'Success' WHERE name = 'CHARGES_CRONJOB';"
                                dbConn.query(cronJobStart, (err, data) => {
                                    if (err) {
                                        console.log({ err: err, msg: 'Cronjob Error', res: 10 });
                                    }
                                })
                            }
                        }
                    })
                }
            });
        })
    } catch (err) {
        let cronJobStart = `UPDATE CronJob set isRunning = 'false',  result = error ${err} WHERE name = 'CHARGES_CRONJOB';`
        dbConn.query(cronJobStart, (err, data) => {
            if (err) {
                console.log({ err: err, msg: 'Cronjob Error', res: 11 });
            }
        })
        console.log({ err: JSON.stringify(err, null, 2), res: 12 });
    }
}

let Crons = {
    ChargesCronjob
}

module.exports = Crons;