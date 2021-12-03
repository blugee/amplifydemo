

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/deleteLicenseInformation', async function (req, res) {
    try {

        let query = `delete from LicenseInformation where ${req.body.filter}`;

        dbConn.query(query, async (err, productData) => {
            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                res.json({ success: 'get call succeed!', body: req.body, });
            }
        })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

module.exports = route
