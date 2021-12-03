

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/generalSettings', async function (req, res) {
    let getQuery = `SELECT * FROM GeneralSetting;`;

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

route.post('/paymentgateway/saveGeneralSettings', async function (req, res) {

    let saveQuery = `insert into GeneralSetting (mapCardUpdateDate, copyrightText, dashboardPageDetails, mapDetails, stateHoverColor, dashboardPageTitle, cancelSubscriptionMessage, enableAutoRenewalMessage, disableAutoRenewalMessage, headerImage, dashboardVideoLink, dashBoardVideoPoster) values ('${req.body.mapCardUpdateDate}', '${req.body.copyrightText}' , '${req.body.dashboardPageDetails}', '${req.body.mapDetails}', '${req.body.stateHoverColor}', '${req.body.dashboardPageTitle}', '${req.body.cancelSubscriptionMessage}', '${req.body.enableAutoRenewalMessage}', '${req.body.disableAutoRenewalMessage}', '${req.body.headerImage}', '${req.body.dashboardVideoLink}', '${req.body.dashBoardVideoPoster}');  `;

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

route.post('/paymentgateway/updateGeneralSettings', async function (req, res) {

    let updateQuery = `update GeneralSetting set mapCardUpdateDate = '${req.body.mapCardUpdateDate}', copyrightText ='${req.body.copyrightText}', dashboardPageDetails = '${req.body.dashboardPageDetails}', mapDetails = '${req.body.mapDetails}', stateHoverColor = '${req.body.stateHoverColor}', dashboardPageTitle = '${req.body.dashboardPageTitle}', cancelSubscriptionMessage = '${req.body.cancelSubscriptionMessage}', enableAutoRenewalMessage = '${req.body.enableAutoRenewalMessage}', disableAutoRenewalMessage = '${req.body.disableAutoRenewalMessage}', headerImage = '${req.body.headerImage}', dashboardVideoLink = '${req.body.dashboardVideoLink}', dashBoardVideoPoster = '${req.body.dashBoardVideoPoster}' where id = '${req.body.id}';`;

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

route.post('/paymentgateway/getDataCountOfState', async function (req, res) {

    let countQuery = `SELECT count(*) as total from LicenseInformation where ${req.body.filter};`;

    dbConn.query(countQuery, async (err, result) => {
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
