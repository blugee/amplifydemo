const dbConn = require('../config');
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var SDKConstants = require('authorizenet').Constants;
var templateService = require('./EmailtemplateService');
var AWS = require('aws-sdk');

/**
 * 
 * @param {*} string 
 * @returns 
 */
const envService = async (string) => {
    return new Promise(async (resolve) => {

        let envQuery = `select * from EnvVariables WHERE name in (${string});`
        dbConn.query(envQuery, async (err, data) => {
            if (err) {
                console.log('err envQuery >', err)
                res.json({ err: err, body: req.body })
            } else {
                let Env = {}
                for (let i = 0; i < data.length; i++) {
                    Env[data[i].name] = data[i].value
                }

                let matchStr = /REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET/;
                if (matchStr.test(string)) {
                    let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
                    merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                    merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])
                    Env.merchantAuthenticationType = merchantAuthenticationType
                }
                resolve(Env)
            }
        })
    })
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} service 
 * @param {*} queryString 
 * @returns 
 */
const authorizenetServices = async (req, res, service, queryString) => {
    return new Promise(async resolve => {
        console.log('service >> ', service);

        if (service == 'GET_CUSTOMER_PROFILE') {
            try {

                let Env = await envService(queryString);
                console.log('Env = await envService', Env);

                let getRequest = new ApiContracts.GetCustomerProfileRequest();
                getRequest.setCustomerProfileId(req.body.customer_profile_id);
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);

                let ctrl = new ApiControllers.GetCustomerProfileController(getRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let UserProfileResponse = new ApiContracts.GetCustomerProfileResponse(apiResponse);
                    console.log(JSON.stringify(UserProfileResponse, null, 2))
                    if (UserProfileResponse != null) {
                        console.log(UserProfileResponse.getMessages().getResultCode())
                        if (UserProfileResponse.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve({ UserProfileResponse, Env })
                        }
                        else {
                            return res.json({ err: UserProfileResponse, url: req.url, body: req.body })
                        }
                    } else {
                        return res.json({ err: 'Null response received!', url: req.url, body: req.body })
                    }
                })
            } catch (error) {
                console.log(error);
                return res.json({ err: error, body: req.body })
            }

        } else if (service == 'CUSTOMER_PROFILE_IDS') {
            try {
                let Env = await envService(queryString);

                let getRequest = new ApiContracts.GetCustomerProfileIdsRequest();
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);

                let ctrl = new ApiControllers.GetCustomerProfileIdsController(getRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.GetCustomerProfileIdsResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            let profileIds = response.getIds().getNumericString();
                            let ids = []
                            for (let i = 0; i < profileIds.length; i++) {
                                ids.push({ id: profileIds[i].toString() });
                            }
                            resolve(ids)
                        }
                        else {
                            return res.json({ err: response.getMessages().getMessage()[0].getText(), body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null response received', body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == "CUSTOMER_BY_CUSTOMER_PROFILE_ID") {
            try {

                let Env = await envService(queryString);

                let getRequest = new ApiContracts.GetCustomerProfileRequest();
                getRequest.setCustomerProfileId(req.params.id);
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);

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
                            resolve(response);
                        }
                        else {
                            return res.json({ err: response, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: "Null response received", body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'CREATE_CUSTOMER_PROFILE') {
            try {
                let Env = await envService(queryString);

                let customerAddress = new ApiContracts.CustomerAddressType();

                let customerPaymentProfileType = new ApiContracts.CustomerPaymentProfileType();
                customerPaymentProfileType.setCustomerType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
                customerPaymentProfileType.setBillTo(customerAddress);

                let paymentProfilesList = [];
                // paymentProfilesList.push(customerPaymentProfileType);

                let customerProfileType = new ApiContracts.CustomerProfileType();
                customerProfileType.setMerchantCustomerId(req.body.customer_id);
                customerProfileType.setEmail(req.body.email);
                customerProfileType.setPaymentProfiles(paymentProfilesList);

                let createRequest = new ApiContracts.CreateCustomerProfileRequest();
                createRequest.setProfile(customerProfileType);
                createRequest.setMerchantAuthentication(Env.merchantAuthenticationType);

                let ctrl = new ApiControllers.CreateCustomerProfileController(createRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);
                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            console.log('Successfully created a customer profile with id: ' + response.getCustomerProfileId());
                            resolve(response)
                        }
                        else {
                            console.log('Result Code: ' + response.getMessages().getResultCode());
                            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                            console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                            return res.json({ err: response, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null response received', body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        }
        else if (service == 'CREATE_CUSTOMER_PAYMENT_PROFILE') {
            try {
                let Env = await envService(queryString);

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

                createRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
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
                        resolve(paymentProfileResponse);
                    } else {
                        return res.json({ err: "Null Response.", body: req.body })
                    }
                })
            } catch (error) {
                console.log(error)
                return res.json({ err: error, body: req.body, res: 'service: 1' })
            }
        }
        else if (service == 'UPDATE_CUSTOMER_PAYMENT_PROFILE') {
            try {
                let Env = await envService(queryString);

                let creditCardForUpdate = new ApiContracts.CreditCardType();
                creditCardForUpdate.setCardNumber(req.body.card_no);
                creditCardForUpdate.setExpirationDate(req.body.expiry_date);

                let paymentType = new ApiContracts.PaymentType();
                paymentType.setCreditCard(creditCardForUpdate);

                let customerAddressType = new ApiContracts.CustomerAddressType();
                customerAddressType.setFirstName(req.body.first_name);
                customerAddressType.setLastName(req.body.last_name);
                customerAddressType.setAddress(req.body.address);
                customerAddressType.setCity(req.body.city);
                customerAddressType.setState(req.body.state);
                customerAddressType.setZip(req.body.zip);
                customerAddressType.setCountry(req.body.country);
                customerAddressType.setPhoneNumber(req.body.phone_no);

                let customerForUpdate = new ApiContracts.CustomerPaymentProfileExType();
                customerForUpdate.setPayment(paymentType);
                customerForUpdate.setCustomerPaymentProfileId(req.body.paymentProfileId);
                customerForUpdate.setBillTo(customerAddressType);

                let updateRequest = new ApiContracts.UpdateCustomerPaymentProfileRequest();
                updateRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                updateRequest.setCustomerProfileId(req.body.customer_profile_id);
                updateRequest.setPaymentProfile(customerForUpdate);
                if (process.env.ENV == 'prod') {
                    updateRequest.setValidationMode(ApiContracts.ValidationModeEnum.LIVEMODE);
                }

                let ctrl = new ApiControllers.UpdateCustomerPaymentProfileController(updateRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let paymentProfileResponse = new ApiContracts.UpdateCustomerPaymentProfileResponse(apiResponse);

                    if (paymentProfileResponse != null) {
                        if (paymentProfileResponse.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(paymentProfileResponse)
                        } else {
                            return res.json({ err: paymentProfileResponse, body: req.body })
                        }
                    } else {
                        return res.json({ err: "Null Response.", body: req.body })
                    }
                })
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'DELETE_CUSTOMER_PROFILE') {
            try {
                let Env = await envService(queryString);

                let deleteRequest = new ApiContracts.DeleteCustomerProfileRequest();
                deleteRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                deleteRequest.setCustomerProfileId(req.body.customer_profile_id);

                let ctrl = new ApiControllers.DeleteCustomerProfileController(deleteRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.DeleteCustomerProfileResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                            console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                            return res.json({ err: response.getMessages().getMessage()[0].getText(), body: req.body, res: "5" })
                        }
                    }
                    else {
                        console.log('Null response received');
                        return res.json({ err: "Null response received", body: req.body, res: "5" })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }

        } else if (service == 'GET_ALL_ACTIVE_SUBSCRIPTION_LIST') {
            try {
                let Env = await envService(queryString);

                let sorting = new ApiContracts.ARBGetSubscriptionListSorting();
                sorting.setOrderDescending(true);
                sorting.setOrderBy(ApiContracts.ARBGetSubscriptionListOrderFieldEnum.CREATETIMESTAMPUTC);

                let listRequest = new ApiContracts.ARBGetSubscriptionListRequest();
                listRequest.setMerchantAuthentication(Env.merchantAuthenticationType);

                listRequest.setSearchType(ApiContracts.ARBGetSubscriptionListSearchTypeEnum.SUBSCRIPTIONACTIVE);
                listRequest.setSorting(sorting);

                let ctrl = new ApiControllers.ARBGetSubscriptionListController(listRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {
                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBGetSubscriptionListResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            return res.json({ err: response, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        }
        else if (service == 'GET_SUBSCRIPTION_BY_ID') {
            try {
                let Env = await envService(queryString);
                let id = req.params.id || req.body.id
                let getRequest = new ApiContracts.ARBGetSubscriptionRequest();
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                getRequest.setSubscriptionId(id);

                let ctrl = new ApiControllers.ARBGetSubscriptionController(getRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {
                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBGetSubscriptionResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            return res.json({ err: response, body: req.body });
                        }
                    }
                    else {
                        return res.json({ err: "Null Response.", body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'CREATE_SUBSCRIPTION') {
            try {
                let Env = await envService(queryString);

                let interval = new ApiContracts.PaymentScheduleType.Interval();
                interval.setLength(1);
                interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

                let paymentScheduleType = new ApiContracts.PaymentScheduleType();
                paymentScheduleType.setInterval(interval);
                paymentScheduleType.setStartDate((new Date()).toISOString().substring(0, 10));
                paymentScheduleType.setTotalOccurrences(9999);
                paymentScheduleType.setTrialOccurrences(0);

                let customerProfileIdType = new ApiContracts.CustomerProfileIdType();
                customerProfileIdType.setCustomerProfileId(req.body.customer_profile_id);
                customerProfileIdType.setCustomerPaymentProfileId(req.UserProfileResponse.profile.paymentProfiles[0].customerPaymentProfileId);

                let orderType = new ApiContracts.OrderType();
                orderType.setDescription(req.body.subscription_name + " Subscription");
                let discount = 0
                let subscriptionAmount = req.price[0].pricePerUnit
                if (req.body.discount && Number(req.body.discount) > 0) {
                    discount = req.body.discount
                    subscriptionAmount = subscriptionAmount - Number(discount)
                }

                let arbSubscription = new ApiContracts.ARBSubscriptionType();
                arbSubscription.setName(req.body.subscription_name);
                arbSubscription.setPaymentSchedule(paymentScheduleType);
                arbSubscription.setOrder(orderType);
                arbSubscription.setAmount(subscriptionAmount);
                arbSubscription.setTrialAmount(0.00);
                arbSubscription.setProfile(customerProfileIdType);

                let createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
                createRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                createRequest.setSubscription(arbSubscription);

                let ctrl = new ApiControllers.ARBCreateSubscriptionController(createRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBCreateSubscriptionResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            return res.json({ err: response, body: req.body, res: 5 })
                        }
                    }
                    else {
                        return res.json({ err: "Null Response.", body: req.body, res: 6 })
                    }
                });
            } catch (error) {
                console.log(error);
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'UPDATE_SUBSCRIPTION') {
            try {
                let Env = await envService(queryString);

                let arbSubscriptionType = new ApiContracts.ARBSubscriptionType();
                if (req.body.subscription_name) {
                    arbSubscriptionType.setName(req.body.subscription_name)
                }
                if (req.price[0].pricePerUnit) {
                    arbSubscriptionType.setAmount(req.price[0].pricePerUnit);
                }

                let updateRequest = new ApiContracts.ARBUpdateSubscriptionRequest();
                updateRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                updateRequest.setSubscriptionId(req.params.id);
                updateRequest.setSubscription(arbSubscriptionType);

                let ctrl = new ApiControllers.ARBUpdateSubscriptionController(updateRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBUpdateSubscriptionResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            return res.json({ err: response, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'UPDATE_SUBSCRIPTION') {
            try {
                let Env = await envService(queryString);

                let arbSubscriptionType = new ApiContracts.ARBSubscriptionType();
                if (req.body.subscription_name) {
                    arbSubscriptionType.setName(req.body.subscription_name)
                }
                if (req.price[0].pricePerUnit) {
                    arbSubscriptionType.setAmount(req.price[0].pricePerUnit);
                }

                let updateRequest = new ApiContracts.ARBUpdateSubscriptionRequest();
                updateRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                updateRequest.setSubscriptionId(req.params.id);
                updateRequest.setSubscription(arbSubscriptionType);

                let ctrl = new ApiControllers.ARBUpdateSubscriptionController(updateRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBUpdateSubscriptionResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            return res.json({ err: response, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'UPDATE_SUBSCRIPTION_OLD_DISCOUNT') {
            try {
                let Env = await envService(queryString);

                let arbSubscriptionType = new ApiContracts.ARBSubscriptionType();
                if (req.body.subscription_name) {
                    arbSubscriptionType.setName(req.body.subscription_name)
                }
                if (req.price[0].pricePerUnit) {
                    let subscriptionAmount = req.price[0].pricePerUnit
                    if (req.userData[0].discount && req.userData[0].discount > 0) {
                        subscriptionAmount = Number(subscriptionAmount) - Number(req.userData[0].discount)
                    }
                    if (req.body.discount && Number(req.body.discount) > 0) {
                        subscriptionAmount = subscriptionAmount - Number(req.body.discount)
                    }
                    arbSubscriptionType.setAmount(subscriptionAmount);
                }

                let updateRequest = new ApiContracts.ARBUpdateSubscriptionRequest();
                updateRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                updateRequest.setSubscriptionId(req.params.id);
                updateRequest.setSubscription(arbSubscriptionType);

                let ctrl = new ApiControllers.ARBUpdateSubscriptionController(updateRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBUpdateSubscriptionResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            return res.json({ err: response, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', body: req.body })
                    }
                });
            } catch (error) {
                console.log(error)
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'SUBSCRIPTION_PAGINATION') {
            try {
                let Env = await envService(queryString);

                let { page, size } = req.body
                let sorting = new ApiContracts.ARBGetSubscriptionListSorting();
                sorting.setOrderDescending(true);
                sorting.setOrderBy(ApiContracts.ARBGetSubscriptionListOrderFieldEnum.CREATETIMESTAMPUTC);

                let paging = new ApiContracts.Paging();
                paging.setOffset(page)
                paging.setLimit(size)

                let listRequest = new ApiContracts.ARBGetSubscriptionListRequest();
                listRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                listRequest.setSearchType(ApiContracts.ARBGetSubscriptionListSearchTypeEnum.SUBSCRIPTIONACTIVE);
                listRequest.setSorting(sorting);
                listRequest.setPaging(paging);

                let ctrl = new ApiControllers.ARBGetSubscriptionListController(listRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {
                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBGetSubscriptionListResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response)
                        }
                        else {
                            return res.json({ err: response, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'DELETE_SUBSCRIPTION') {
            try {
                let Env = await envService(queryString);

                let cancelRequest = new ApiContracts.ARBCancelSubscriptionRequest();
                cancelRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                cancelRequest.setSubscriptionId(req.params.id);

                let ctrl = new ApiControllers.ARBCancelSubscriptionController(cancelRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.ARBCancelSubscriptionResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response);
                        }
                        else {
                            return res.json({ err: response, body: response });
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'GET_TRANSACTION_BATCH_LIST') {
            try {
                let Env = await envService(queryString);

                let dateAWeekAgoISO = new Date(req.body.start_date).toISOString();
                let dateNowISO = new Date(req.body.end_date).toISOString();

                let createRequest = new ApiContracts.GetSettledBatchListRequest();
                createRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                createRequest.setIncludeStatistics(true);
                createRequest.setFirstSettlementDate(dateAWeekAgoISO);
                createRequest.setLastSettlementDate(dateNowISO);

                let ctrl = new ApiControllers.GetSettledBatchListController(createRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.GetSettledBatchListResponse(apiResponse);

                    console.log(JSON.stringify(response, null, 2));

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response);
                        }
                        else {
                            return res.json({ err: response, url: req.url, body: req.body, dateAWeekAgoISO: dateAWeekAgoISO, dateNowISO: dateNowISO })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', url: req.url, body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'GET_TRANSACTIONS_BY_BATCH_ID') {
            try {
                let Env = await envService(queryString);

                let paging = new ApiContracts.Paging();
                paging.setLimit(req.body.size);
                paging.setOffset(req.body.page);

                let sorting = new ApiContracts.TransactionListSorting();
                sorting.setOrderBy(ApiContracts.TransactionListOrderFieldEnum.ID);
                sorting.setOrderDescending(true);

                let getRequest = new ApiContracts.GetTransactionListRequest();
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                getRequest.setBatchId(req.params.batchId);
                getRequest.setPaging(paging);
                getRequest.setSorting(sorting);

                let ctrl = new ApiControllers.GetTransactionListController(getRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.GetTransactionListResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            let success = {}
                            if (response.getTransactions() != null) {
                                success.message = response.getMessages().getResultCode()
                                success.transactions = response.getTransactions().getTransaction();
                                success.total = response.getTotalNumInResultSet()
                                resolve(success)
                            } else {
                                success.message = response.getMessages().getMessage()[0].getCode();
                                success.transactions = response.getMessages().getMessage()[0].getText();
                                resolve(success)
                            }
                        }
                        else {
                            return res.json({ err: response, url: req.url, body: req.body })
                        }
                    }
                    else {
                        console.log('Null Response.');
                        return res.json({ err: 'Null Response.', url: req.url, body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'GET_UNSETTLED_TRANSACTIONS') {
            try {
                let Env = await envService(queryString);

                let paging = new ApiContracts.Paging();
                paging.setLimit(req.body.size);
                paging.setOffset(req.body.page);

                let sorting = new ApiContracts.TransactionListSorting();
                sorting.setOrderBy(ApiContracts.TransactionListOrderFieldEnum.ID);
                sorting.setOrderDescending(true);

                let getRequest = new ApiContracts.GetUnsettledTransactionListRequest();
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                getRequest.setPaging(paging);
                getRequest.setSorting(sorting);

                let ctrl = new ApiControllers.GetUnsettledTransactionListController(getRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.GetUnsettledTransactionListResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            let success = {}
                            if (response.getTransactions() != null) {
                                let transaction = response.getTransactions().getTransaction();

                                let transactionArray = transaction.map((item, i) => {
                                    let customerProfileId = ""
                                    let customerPaymentProfileId = ""

                                    if (item.profile && item.profile.customerProfileId) {
                                        customerProfileId = item.profile.customerProfileId
                                    }

                                    if (item.profile && item.profile.customerPaymentProfileId) {
                                        customerPaymentProfileId = item.customerPaymentProfileId
                                    }
                                    return {
                                        ...item,
                                        customerProfileId: customerProfileId,
                                        customerPaymentProfileId: customerPaymentProfileId
                                    };
                                });
                                if (Array.isArray(transactionArray)) {
                                    success.message = response.getMessages().getResultCode()
                                    success.transactions = transactionArray
                                    success.total = response.getTotalNumInResultSet()
                                    resolve(success);
                                } else {
                                    success.message = transactionArray
                                    success.total = response.getTotalNumInResultSet()
                                    resolve(success);
                                }
                            } else {
                                success.message = response.getMessages().getMessage()[0].getCode();
                                success.transactions = response.getMessages().getMessage()[0].getText();
                                resolve(success)
                            }
                        }
                        else {
                            return res.json({ err: response, url: req.url, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', url: req.url, body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'GET_TRANSACTIONS_BY_CUSTOMER_PROFILE_ID') {
            try {
                let Env = await envService(queryString);

                let { page, size } = req.body

                let paging = new ApiContracts.Paging();
                paging.setLimit(size);
                paging.setOffset(page);

                let sorting = new ApiContracts.TransactionListSorting();
                sorting.setOrderBy(ApiContracts.TransactionListOrderFieldEnum.ID);
                sorting.setOrderDescending(true);

                let getRequest = new ApiContracts.GetTransactionListForCustomerRequest();
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                getRequest.setCustomerProfileId(req.params.customerProfileId);
                getRequest.setPaging(paging);
                getRequest.setSorting(sorting);

                let ctrl = new ApiControllers.GetTransactionListForCustomerController(getRequest.getJSON());
                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }
                ctrl.execute(function () {

                    let apiResponse = ctrl.getResponse();

                    let response = new ApiContracts.GetTransactionListResponse(apiResponse);

                    if (response != null) {
                        if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(response);
                        }
                        else {
                            return res.json({ err: response, url: req.url, body: req.body })
                        }
                    }
                    else {
                        return res.json({ err: 'Null Response.', url: req.url, body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        } else if (service == 'GET_TRANSACTION_BY_ID') {
            try {
                let Env = await envService(queryString);

                let getRequest = new ApiContracts.GetTransactionDetailsRequest();
                getRequest.setMerchantAuthentication(Env.merchantAuthenticationType);
                getRequest.setTransId(req.body.transactionId);

                console.log(JSON.stringify(getRequest.getJSON(), null, 2));

                let ctrl = new ApiControllers.GetTransactionDetailsController(getRequest.getJSON());

                if (process.env.ENV == 'prod') {
                    ctrl.setEnvironment(SDKConstants.endpoint.production);
                }

                ctrl.execute(async function () {

                    let apiResponse = ctrl.getResponse();

                    let transactionDetailsResponse = new ApiContracts.GetTransactionDetailsResponse(apiResponse);

                    console.log(JSON.stringify(transactionDetailsResponse, null, 2));

                    if (transactionDetailsResponse != null) {
                        if (transactionDetailsResponse.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                            resolve(transactionDetailsResponse);
                        }
                        else {
                            res.json({ err: transactionDetailsResponse, body: req.body })
                        }
                    }
                    else {
                        res.json({ err: "Null transaction details response.", body: req.body })
                    }
                });
            } catch (error) {
                return res.json({ err: error, body: req.body })
            }
        }

    })
}


const sendEmailService = async (req, res) => {
    try {
        return new Promise(async resolve => {
            let email = req.email
            if (email) {
                var params = {
                    Filter: `email=\"${email}\"`,
                    UserPoolId: req.Env['REACT_APP_USER_POOL_ID']
                };
                AWS.config.update({ region: req.Env['REACT_APP_REGION'], 'accessKeyId': req.Env['REACT_APP_ACCESS_KEY_ID'], 'secretAccessKey': req.Env['REACT_APP_SECRET_ACCESS_KEY'] });
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

                                if (req.subscription == 'BASIC') {
                                    req.subscriptionPaymentSchedule = {
                                        subscriptionName: 'BASIC',
                                        totalOccurrences: 9999,
                                        id: `BASIC_${req.body.customer_profile_id}`,
                                        amount: 0,
                                        interval: {
                                            length: 1,
                                            unit: 'month'
                                        }
                                    }
                                }

                                const sender = req.Env['REACT_APP_CONTACT_COMPANY_EMAIL'];
                                const recipient = email;

                                emailData = await templateService.replaceVariables(emailData, dataObj, req, 'subscription', sender)

                                const charset = "UTF-8";

                                const ses = new AWS.SES({
                                    apiVersion: req.Env['REACT_APP_SES_API_VERSION'],
                                    region: req.Env['REACT_APP_SES_REGION'],
                                    accessKeyId: req.Env['REACT_APP_SES_ACCESS_KEY_ID'],
                                    secretAccessKey: req.Env['REACT_APP_SES_SECRET_ACCESS_KEY'],
                                    endpoint: req.Env['REACT_APP_SES_ENDPOINT'],
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
                                        resolve(resultData)
                                    }).catch(
                                        function (err) {
                                            res.json({ err: err, body: req.body, })

                                        })
                            })
                        } else {
                            return res.json({ err: 'user not found', body: req.body, data: data })
                        }
                    }
                })
            } else {
                return res.json({ err: 'Customer not found', body: req.body })
            }
        })
    } catch (error) {
        console.log(error);
        return res.json({ err: error, body: req.body })
    }
}


const services = {
    envService,
    authorizenetServices,
    sendEmailService
}

module.exports = services