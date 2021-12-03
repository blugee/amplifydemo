

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/demoData', async function (req, res) {
    let getQuery = `SELECT * FROM DemoData;`;

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




module.exports = route
