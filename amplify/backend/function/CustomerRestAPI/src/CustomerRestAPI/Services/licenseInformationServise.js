const dbConn = require('../config');
const getFiltersAndOrder = require('./getFiltersAndOrder');
const generalService = require('./generalService')
const https = require('https')

module.exports = {

    getLicenseInformation: async (req, res) => {

        let selectedItem = await generalService.validateSubscriptionByAccessKey(req, res, true)
        if (selectedItem) {
            let filters = ''
            if (req.body.filter) {
                filters = await getFiltersAndOrder.getFilters(req.body.filter)
            }
            let pageNumber = 1
            let pageSize = 100
            if (req.body.page) {
                pageNumber = req.body.page
            }
            if (req.body.size) {
                if (Number(req.body.size) <= 100) {
                    pageSize = req.body.size
                } else {
                    res.json({ err: 'The size limit is 100', body: req.body })
                }
            }

            let orderBy = ''
            if (req.body.orderByColumn && req.body.order) {
                orderBy = await getFiltersAndOrder.getOrder(req.body.orderByColumn, req.body.order)
            }

            let licenseQuery = `select * from LicenseInformation ${filters} ${orderBy} limit ${pageNumber}, ${pageSize}`;

            dbConn.query(licenseQuery, async (err, licenseData) => {
                if (err) {
                    if (err.errno === 1054) {
                        res.json({ err: "requested body field inappropriate", body: req.body })
                    } else {
                        res.json({ err: err, body: req.body })
                    }
                } else {

                    let countQuery = `select count(*) as total from LicenseInformation  ${filters}  ${orderBy}  `;

                    dbConn.query(countQuery, async (err, countData) => {
                        if (err) {
                            if (err.errno === 1054) {
                                res.json({ err: "requested body field inappropriate", body: req.body })
                            } else {
                                res.json({ err: err, body: req.body })
                            }
                        } else {
                            if (selectedItem !== true) {
                                let total = Number(licenseData.length) * Number(selectedItem.pricePerUnit)
                                let chargeQuery = `INSERT INTO Charge (customerProfileId, customerPaymentProfileId, priceId, description, productName, noOfRecordsFetch, chargeAmount, pricePerUnit)
                                VALUES ('${selectedItem.customer_profile_id}', '${selectedItem.customerPaymentProfileId}', '${selectedItem.id}', 'charge for custome rest API', 'CUSTOMER_REST_API', '${licenseData.length}', '${total}', '${selectedItem.pricePerUnit}');`
                                dbConn.query(chargeQuery, function (err, charge) {
                                    if (err) {
                                        res.json({ err: 'Something bad happen', body: req.body })
                                    } else {
                                        res.json({ success: 'post call succeed!', total: countData[0].total, licenseData: licenseData, })
                                    }
                                })
                            }else{
                                res.json({ success: 'post call succeed!', total: countData[0].total, licenseData: licenseData, })
                            }
                           
                        }
                    })

                }
            })
        } else {
            res.json({ err: 'Something bad happen', body: req.body })
        }

    }
}