

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/PurchaseOrderSettings', async function (req, res) {
    let getQuery = `SELECT * FROM PurchaseOrderSettings;`;

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

route.post('/paymentgateway/savePurchaseOrderSettings', async function (req, res) {

    let saveQuery = `insert into PurchaseOrderSettings (email, emailSubject, popupTitle, popupDescription) values ('${req.body.email}', '${req.body.emailSubject}','${req.body.popupTitle}','${req.body.popupDescription}');`;

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

route.post('/paymentgateway/updatePurchaseOrderSettings', async function (req, res) {

    let updateQuery = `update PurchaseOrderSettings set email = '${req.body.email}', emailSubject ='${req.body.emailSubject}', popupTitle ='${req.body.popupTitle}', popupDescription ='${req.body.popupDescription}'  where id = '${req.body.id}';`;

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
