const dbConn = require('../config');
const getFiltersAndOrder = require('./getFiltersAndOrder');
const generalService = require('./generalService')


module.exports = {

    getLicenseStatus: async (req, res) => {
        let isValidSubscription = await generalService.validateSubscriptionByAccessKey(req, res)
        if (isValidSubscription) {
            let filters = ''
            if (req.body.filter) {
                filters = await getFiltersAndOrder.getFilters(req.body.filter)
            }

            let licenseQuery = `select DISTINCT(licenseStatus) as items from LicenseInformation ${filters} order by licenseStatus ASC`;

            dbConn.query(licenseQuery, async (err, licenseStatus) => {
                if (err) {
                    if (err.errno === 1054) {
                        res.json({ err: "requested body field inappropriate", body: req.body })
                    } else {
                        res.json({ err: err, body: req.body })
                    }
                } else {
                    res.json({ success: 'post call succeed!', licenseStatus: licenseStatus })
                }
            })

        } else {
            res.json({ err: 'Something bad happen', body: req.body })
        }
    }
}