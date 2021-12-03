

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/maintenanceWindowSettings', async function (req, res) {
    let getQuery = `SELECT * FROM MaintenanceWindow;`;

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

route.post('/paymentgateway/saveMaintenanceWindowSettings', async function (req, res) {

    let saveQuery = `insert into MaintenanceWindow ( maintenanceWindow, maintenanceWindowMessage) values ('${req.body.maintenanceWindow}','${req.body.maintenanceWindowMessage}' );  `;

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

route.post('/paymentgateway/updateMaintenanceWindowSettings', async function (req, res) {

    let updateQuery = `update MaintenanceWindow set maintenanceWindow = '${req.body.maintenanceWindow}', maintenanceWindowMessage ='${req.body.maintenanceWindowMessage}' where id = '${req.body.id}';`;

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
