

var express = require('express')
const route = express.Router()
var service = require('./Service/generalService');

/****************************
* Example post method *
****************************/

route.post('/paymentgateway/transaction/batchlists', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
        let response = await service.authorizenetServices(req, res, 'GET_TRANSACTION_BATCH_LIST', envQuery);

        return res.json({ success: "get call succeed!", Transactions: response })

    } catch (error) {
        res.json({ err: error, url: req.url, body: req.body })
    }
});

route.post('/paymentgateway/transaction/:batchId', async function (req, res) {
    try {

        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`
        let response = await service.authorizenetServices(req, res, 'GET_TRANSACTIONS_BY_BATCH_ID', envQuery);

        return res.json({ success: "get call succeed!", transactions: response })

    } catch (error) {
        res.json({ err: error, url: req.url, body: req.body })
    }
});

route.post('/paymentgateway/unsettledtransaction', async function (req, res) {
    try {
        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

        let response = await service.authorizenetServices(req, res, 'GET_UNSETTLED_TRANSACTIONS', envQuery);

        return res.json({ success: "get call succeed!", transactions: response })
    } catch (error) {
        return res.json({ err: error, url: req.url, body: req.body })
    }
});

route.post('/paymentgateway/transection/:customerProfileId', async function (req, res) {
    try {

        let envQuery = `'REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET','REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'`

        let response = await service.authorizenetServices(req, res, 'GET_TRANSACTIONS_BY_CUSTOMER_PROFILE_ID', envQuery);

        return res.json({ success: 'get call succeed!', Transactions: response })

    } catch (error) {
        res.json({ err: error, url: req.url, body: req.body })
    }
});

module.exports = route