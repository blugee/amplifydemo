

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/supportSettings', async function (req, res) {
    let getQuery = `SELECT * FROM SupportSettings;`;

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

route.post('/paymentgateway/saveSupportSettings', async function (req, res) {

    let saveQuery = `insert into SupportSettings ( hearFromYouDeatils, hearFromYouTitle, dropUsTitle, issueCategories ) values ('${req.body.hearFromYouDeatils}','${req.body.hearFromYouTitle}','${req.body.dropUsTitle}','${req.body.issueCategories}' );  `;

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

route.post('/paymentgateway/updateSupportSettings', async function (req, res) {

    let updateQuery = `update SupportSettings set dropUsTitle = '${req.body.dropUsTitle}', hearFromYouDeatils ='${req.body.hearFromYouDeatils}', hearFromYouTitle ='${req.body.hearFromYouTitle}', issueCategories ='${req.body.issueCategories}' where id = '${req.body.id}';`;

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
