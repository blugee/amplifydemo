var express = require('express')
const route = express.Router()
const dbConn = require('./config');
const CronJob = require('./CronJob');
const utils = require('./Utils/utils');

route.post('/paymentgateway/restart/cronjob', async function (req, res) {
    if (req.body.cronjobName == "CHARGES_CRONJOB") {
        CronJob.ChargesApi()
        return res.json({ success: 'post call succeed!' })
    }
    else {
        CronJob.CancelSubscriptionApi()
        return res.json({ success: 'post call succeed!' })
    }
})


route.get('/paymentgateway/cronjobs', async function (req, res) {
    let getQuery = `SELECT * FROM CronJob;`;

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

route.post('/paymentgateway/cronlogs', async function (req, res) {

    try {
        const { page, size, cronJob, startDate, endDate } = req.body;
        let { limit, offset } = utils.getPagination(page, size);
        let cronLogsQuery
        let countQuery
        if (cronJob === 'ALL' && startDate && endDate) {
            cronLogsQuery = `select * from cronLogs WHERE date BETWEEN '${startDate}' AND '${endDate}' ORDER BY date DESC LIMIT ${limit} OFFSET ${offset};`;
            countQuery = `SELECT COUNT(id) AS total FROM cronLogs WHERE date BETWEEN '${startDate}' AND '${endDate}';`
        } else if (cronJob === 'ALL' && !startDate && !endDate) {
            cronLogsQuery = `select * from cronLogs ORDER BY date DESC LIMIT ${limit} OFFSET ${offset};`;
            countQuery = `SELECT COUNT(id) AS total FROM cronLogs;`
        }
        else if (!startDate && !endDate) {
            cronLogsQuery = `select * from cronLogs WHERE cronJob = '${cronJob}' ORDER BY date DESC LIMIT ${limit} OFFSET ${offset};`;
            countQuery = `SELECT COUNT(id) AS total FROM cronLogs WHERE cronJob = '${cronJob}';`
        } else {
            cronLogsQuery = `select * from cronLogs WHERE cronJob = '${cronJob}' AND date BETWEEN '${startDate}' AND '${endDate}' ORDER BY date DESC LIMIT ${limit} OFFSET ${offset};`;
            countQuery = `SELECT COUNT(id) AS total FROM cronLogs WHERE cronJob = '${cronJob}' AND date BETWEEN '${startDate}' AND '${endDate}';`
        }

        dbConn.query(countQuery, function (err, count) {
            if (err) {
                res.json({ err: err, body: req.body })
            }
            dbConn.query(cronLogsQuery, function (err, data) {
                if (err) {
                    res.json({ err: err, body: req.body })
                } else {
                    if (data) {
                        if (err) {
                            res.json({ err: err, body: req.body })
                        } else {
                            count = count[0].total
                            data = utils.getPagingData(data, count, page, size);
                            res.json({ success: 'get call succeed!', cronLogs: data })
                        }
                    }
                }
            })
        })
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
})


module.exports = route
