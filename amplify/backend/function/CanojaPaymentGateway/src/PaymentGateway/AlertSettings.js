

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/alertSettings', async function (req, res) {
    let getQuery = `SELECT * FROM AlertSettings;`;

    dbConn.query(getQuery, async (err, result) => {
        if (err) {
            if (err.errno === 1054) {
                res.json({ err: "requested body field inappropriate", body: req.body })
            } else {
                res.json({ err: err, body: req.body })
            }
        } else {

            res.json({ success: 'post call succeed!', result: result, })
        }
    })
})

route.post('/paymentgateway/saveAlertSettings', async function (req, res) {

    let saveQuery = `insert into AlertSettings (reportSuccess, reportError, purchaseSuccess, purchaseError, loginSuccess, loginError, genericAlert, subscriptionInterruption, reportGenerate, reportPurchase, invalidCardErrorMessage, generalCardErrorMessage ) values ('${req.body.reportSuccess}', '${req.body.reportError}','${req.body.purchaseSuccess}','${req.body.purchaseError}','${req.body.loginSuccess}','${req.body.loginError}','${req.body.genericAlert}','${req.body.subscriptionInterruption}','${req.body.reportGenerate}','${req.body.reportPurchase}', '${req.body.invalidCardErrorMessage}', '${req.body.generalCardErrorMessage}' );  `;

    dbConn.query(saveQuery, async (err, result) => {
        if (err) {
            if (err.errno === 1054) {
                res.json({ err: 'requested body field inappropriate', body: req.body })
            } else {
                res.json({ err: err, body: req.body })
            }
        } else {

            res.json({ success: 'post call succeed!', result: result, })
        }
    })
})

route.post('/paymentgateway/updateAlertSettings', async function (req, res) {

    let updateQuery = `update AlertSettings set reportSuccess = '${req.body.reportSuccess}', reportError ='${req.body.reportError}', purchaseSuccess ='${req.body.purchaseSuccess}', purchaseError ='${req.body.purchaseError}', loginSuccess ='${req.body.loginSuccess}', loginError ='${req.body.loginError}', genericAlert ='${req.body.genericAlert}', subscriptionInterruption='${req.body.subscriptionInterruption}', reportGenerate = '${req.body.reportGenerate}', reportPurchase = '${req.body.reportPurchase}', invalidCardErrorMessage = '${req.body.invalidCardErrorMessage}', generalCardErrorMessage = '${req.body.generalCardErrorMessage}' where id = '${req.body.id}';`;

    dbConn.query(updateQuery, async (err, result) => {
        if (err) {
            if (err.errno === 1054) {
                res.json({ err: 'requested body field inappropriate', body: req.body })
            } else {
                res.json({ err: err, body: req.body })
            }
        } else {

            res.json({ success: 'post call succeed!', result: result, })
        }
    })
})



module.exports = route
