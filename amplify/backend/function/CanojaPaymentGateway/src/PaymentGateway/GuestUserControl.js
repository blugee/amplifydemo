

var express = require('express')
const route = express.Router()
const dbConn = require('./config');

route.post('/paymentgateway/addUsageControl', async function (req, res) {
    try {
        let orderBy = req.body.orderBy ? req.body.orderBy : "licenseNumber ASC"
        let filter = req.body.filter ? req.body.filter : "active = 'true'"

        let limit = req.body.size ? req.body.size : 5
        let page = req.body.page ? req.body.page : 1
        let offset = (page - 1) * limit
        let licenceQuery = `SELECT * from LicenseInformation where ${filter} order by ${orderBy} limit ${limit} OFFSET ${offset}`;

        dbConn.query(licenceQuery, async (err, licence) => {
            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                let pageSize = licence.length
                let query = `select * from GuestUserControl where uniqueID = '${req.body.uniqueId}'`;

                dbConn.query(query, async (err, users) => {
                    if (err) {
                        res.json({ err: err, body: req.body })
                    } else {
                        let subscriptionQuery = `select * from SubscriptionSettings`;
                        dbConn.query(subscriptionQuery, async (err, settings) => {
                            let limit = 0
                            if (err) {
                                limit = 100
                            } else {
                                if (settings && settings.length > 0 && settings[0].dailyLimit && Number(settings[0].dailyLimit)) {
                                    limit = Number(settings[0].dailyLimit)
                                }
                            }
                            if (users && users.length > 0) {
                                let recordUsage = 0
                                if (users[0].recordUsage && Number(users[0].recordUsage)) {
                                    recordUsage = Number(users[0].recordUsage)
                                }

                                let total = recordUsage + Number(pageSize)
                                if (limit && total > limit) {
                                    res.json({ err: err, body: req.body, code: 'LIMIT_EXCEEDED' })
                                } else {
                                    let updateQuery = `update GuestUserControl set uniqueID = '${req.body.uniqueId}', customerID ='${req.body.customerId}', recordUsage ='${total}' where id = '${users[0].id}';`;
                                    dbConn.query(updateQuery, async (err, users) => {
                                        if (err) {
                                            res.json({ err: err, body: req.body })
                                        } else {
                                            res.json({ success: 'get call succeed!', body: req.body, usage: total, limit: limit });
                                        }
                                    })
                                }

                            } else {
                                let addQuery = `insert into GuestUserControl (uniqueID, customerID, recordUsage ) values ('${req.body.uniqueId}', '${req.body.customerId}','${pageSize}' );`;
                                dbConn.query(addQuery, async (err, users) => {
                                    if (err) {
                                        res.json({ err: err, body: req.body })
                                    } else {
                                        res.json({ success: 'get call succeed!', body: req.body, limit: limit, usage: pageSize });
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })

    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

module.exports = route
