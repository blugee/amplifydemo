var express = require('express');
const route = express.Router();
const dbConn = require('./config');
const utils = require('./Utils/utils')


route.get('/paymentgateway/subscriptionrequest/:id', async function (req, res) {
    try {
        let requestQuery = `select * from YearlySubscriptionRequest where id = ${req.params.id}`
        dbConn.query(requestQuery, function (err, subscriptionRequest) {
            if (err) {

            } else {

                if (subscriptionRequest.length > 0) {
                    res.json({ success: 'get call succeed!', subscriptionItem: subscriptionRequest });
                } else {
                    res.json({ err: 'No data found!', subscriptionItem: subscriptionRequest });
                }
            }
        })
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

/****************************
* Example post method *
****************************/

route.post('/paymentgateway/subscriptionrequest', async function (req, res) {
    try {

        if (!req.body.companyName || !req.body.email || !req.body.description || !req.body.postalCode || !req.body.address || !req.body.city || !req.body.country || !req.body.state) {
            return res.json({ err: "Please provide all values", body: req.body })
        }
        let createRequestQuery = `insert into YearlySubscriptionRequest (companyName, email, description, postalCode, address, city, state, country) 
        VALUES ('${req.body.companyName}', '${req.body.email}', '${req.body.description}', '${req.body.postalCode}', '${req.body.address}', '${req.body.city}', '${req.body.state}', '${req.body.country}');`
        dbConn.query(createRequestQuery, function (err, data) {
            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                res.json({ success: 'post call succeed!', url: req.url, body: req.body, subscriptionRequest: data })
            }
        });
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

route.post('/paymentgateway/pagination/subscriptionrequest', async function (req, res) {
    try {
        const { page, size } = req.body
        let { limit, offset } = utils.getPagination(page, size);

        let getSubscriptionRequest = `select * from YearlySubscriptionRequest ORDER BY id DESC LIMIT ${limit} OFFSET ${offset};`;
        let countQuery = `SELECT COUNT(id) AS total FROM YearlySubscriptionRequest;`

        dbConn.query(countQuery, function (err, count) {
            dbConn.query(getSubscriptionRequest, function (err, data) {
                if (err) {
                    res.json({ err: err, body: req.body })
                } else {
                    if (data) {
                        if (err) {
                            res.json({ err: err, body: req.body })
                        } else {
                            count = count[0].total
                            data = utils.getPagingData(data, count, page, size);
                            res.json({ success: 'get call succeed!', url: req.url, body: req.body, Charge: data })
                        }
                    }
                }
            })
        })
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});


/****************************
* Example put method *
****************************/

route.put('/paymentgateway/update/subscriptionrequest', async function (req, res) {
    try {
        if (req.body.id) {
            let updateRequestQuery = `update YearlySubscriptionRequest set companyName = '${req.body.companyName}', email = '${req.body.email}', description = '${req.body.description}', postalCode = '${req.body.postalCode}', address = '${req.body.address}', city = '${req.body.city}', state = '${req.body.state}', country = '${req.body.country}' where id = '${req.body.id};'`
            dbConn.query(updateRequestQuery, function (err, data) {
                if (err) {
                    res.json({ err: err, body: req.body })
                } else {
                    res.json({ success: 'Details Saved successfully', url: req.url, body: req.body, subscriptionRequest: data })
                }
            });
        } else {
            res.json({ err: "Please provide id!", body: req.body })
        }
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});

/****************************
* Example delete method *
****************************/

route.delete('/paymentgateway/delete/subscriptionrequests/:id', async function (req, res) {
    try {
        let deleteRequestQuery = `delete from YearlySubscriptionRequest where id = '${req.params.id}'`
        dbConn.query(deleteRequestQuery, function (err, data) {
            if (err) {
                res.json({ err: err, body: req.body })
            } else {
                res.json({ success: 'delete call succeed!', url: req.url, body: req.body, subscriptionRequest: data })
            }
        });
    } catch (err) {
        res.json({ err: err, body: req.body })
    }
});



module.exports = route
