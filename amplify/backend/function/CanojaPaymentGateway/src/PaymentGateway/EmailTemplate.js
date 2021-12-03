

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/emailTemplate', async function (req, res) {
    let getQuery = `SELECT * FROM EmailTemplate;`;

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

route.post('/paymentgateway/getEmailTemplateById', async function (req, res) {

    let saveQuery = `SELECT * FROM EmailTemplate  where id = '${req.body.id}';`;

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

route.post('/paymentgateway/saveEmailTemplate', async function (req, res) {
    let design = req.body.design

    let saveQuery = `insert into EmailTemplate (event, subject, design, html) values ('${req.body.event}', '${req.body.subject}' , '${design}' , "${req.body.html}" );  `;

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

route.post('/paymentgateway/updateEmailTemplate', async function (req, res) {
    let design = req.body.design

    let updateQuery = `update EmailTemplate set event = '${req.body.event}', subject ='${req.body.subject}', design = '${design}', html = "${req.body.html}" where id = '${req.body.id}';`;

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

route.post('/paymentgateway/deleteEmailTemplate', async function (req, res) {

    let updateQuery = `DELETE FROM EmailTemplate where id = '${req.body.id}';`;

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
