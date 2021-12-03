

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/subscriptionSettings', async function (req, res) {
    let getQuery = `SELECT * FROM SubscriptionSettings;`;

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

route.post('/paymentgateway/saveSubscriptionSettings', async function (req, res) {

    let saveQuery = `insert into SubscriptionSettings (condition1, condition2, condition3,signupAgreementDetails,subscriptionAgreementDetails, sampleDataReportTitle, sampleDataReportDetails, dailyLimit, overLimitMessage, queryLimitMessage, defaultSubscriptionType, yearlySubscriptionMessage, yearlySubscriptionTitle, yearlySubscriptionDescription, yearlySubscriptionFormTitle, startSubscriptionMessage, upgradeSubscriptionMessage) values ('${req.body.condition1}', '${req.body.condition2}' , '${req.body.condition3}' , '${req.body.signupAgreementDetails}' , '${req.body.subscriptionAgreementDetails}', '${req.body.sampleDataReportTitle}', '${req.body.sampleDataReportDetails}', '${req.body.dailyLimit}', '${req.body.overLimitMessage}', '${req.body.queryLimitMessage}', '${req.body.defaultSubscriptionType}', '${req.body.yearlySubscriptionMessage}', '${req.body.yearlySubscriptionTitle}', '${req.body.yearlySubscriptionDescription}', '${req.body.yearlySubscriptionFormTitle}', '${req.body.startSubscriptionMessage}', '${req.body.upgradeSubscriptionMessage}');`;

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

route.post('/paymentgateway/updateSubscriptionSettings', async function (req, res) {

    let updateQuery = `update SubscriptionSettings set condition1 = '${req.body.condition1}', condition2 ='${req.body.condition2}', condition3 = '${req.body.condition3}', signupAgreementDetails = '${req.body.signupAgreementDetails}', subscriptionAgreementDetails = '${req.body.subscriptionAgreementDetails}', sampleDataReportTitle = '${req.body.sampleDataReportTitle}', sampleDataReportDetails = '${req.body.sampleDataReportDetails}', dailyLimit = '${req.body.dailyLimit}', overLimitMessage = '${req.body.overLimitMessage}', queryLimitMessage = '${req.body.queryLimitMessage}', defaultSubscriptionType = '${req.body.defaultSubscriptionType}', yearlySubscriptionMessage = '${req.body.yearlySubscriptionMessage}', yearlySubscriptionTitle = '${req.body.yearlySubscriptionTitle}', yearlySubscriptionDescription = '${req.body.yearlySubscriptionDescription}', yearlySubscriptionFormTitle = '${req.body.yearlySubscriptionFormTitle}', startSubscriptionMessage = '${req.body.startSubscriptionMessage}', upgradeSubscriptionMessage = '${req.body.upgradeSubscriptionMessage}'  where id = '${req.body.id}';`;

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
