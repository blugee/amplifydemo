

var express = require('express')
const route = express.Router()
const dbConn = require('./config');



route.post('/paymentgateway/licenseMainFilter', async function (req, res) {
    let query = `insert into LicenseMainFilterList (name, filter, active, filterOrder) values ('${req.body.name}', '${req.body.filter}' , '${req.body.active}' , '${req.body.filterOrder}');  `;
    try {

        dbConn.query(query, async (err, data) => {

            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                res.json({ success: 'post call succeed!', url: req.url, body: req.body, data: data })
            }
        })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

route.post('/paymentgateway/licenseMainFilter/:id', async function (req, res) {
    let query = `UPDATE LicenseMainFilterList
    SET name='${req.body.name}', filter='${req.body.filter}', active='${req.body.active}', filterOrder='${req.body.filterOrder}'
    WHERE id=${req.params.id};  `;
    try {

        dbConn.query(query, async (err, data) => {

            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                res.json({ success: 'post call succeed!', url: req.url, body: req.body, data: data })
            }
        })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});


module.exports = route
