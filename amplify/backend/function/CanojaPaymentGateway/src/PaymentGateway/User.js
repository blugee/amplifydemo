var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/user/batchById', async function (req, res) {
    try {
        let idArray = ''


        for (let i = 0; i < req.body.userId.length; i++) {
            const element = req.body.userId[i]
            if (req.body.userId.length - 1 === i) {
                idArray += `${element}`
            } else {
                idArray += `${element},`
            }
        }

        if (idArray) {
            let getQuery = `SELECT id, email, customerProfileId FROM User where customerProfileId IN (${idArray})`;

            dbConn.query(getQuery, async (err, result) => {
                if (err) {
                    if (err.errno === 1054) {
                        res.json({ err: "requested body field inappropriate", body: req.body, idArray: idArray })
                    } else {
                        res.json({ err: err, body: req.body })
                    }
                } else {
                    res.json({ success: 'post call succeed!', result: result, })
                }
            })
        } else {
            res.json({ success: 'post call succeed!', result: [], })
        }
    } catch (error) {
        res.json({ err: error, body: req.body })

    }

})

module.exports = route
