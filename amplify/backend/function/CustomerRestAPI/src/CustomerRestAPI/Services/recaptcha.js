const dbConn = require('../config');
const axios = require('axios')

module.exports = {

    verifyReCaptcha: async (req, res) => {
        try {
            if (req.body['g-recaptcha-response']) {
                let envQuery = `select * from EnvVariables WHERE name in ('RECAPTCHA_SECRET_KEY');`
                dbConn.query(envQuery, async (err, envVariable) => {
                    if (err) {
                        res.json({ err: err, body: req.body });
                    } else {
                        if (envVariable && envVariable.length > 0) {
                            let Env = {}
                            for (let i = 0; i < envVariable.length; i++) {
                                Env[envVariable[i].name] = envVariable[i].value
                            }
                            var VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${Env['RECAPTCHA_SECRET_KEY']}&response=${req.body['g-recaptcha-response']}`;
                            let data = await axios.post(VERIFY_URL)

                            if (data && data.data) {
                                let response = data.data
                                if (response.success) {
                                    if (response.score > 0.4) {
                                        response = {}
                                        response.code = 'HUMAN'
                                        return res.json({ success: "Get call succeed!", data: response });
                                    } else {
                                        response = {}
                                        response.code = 'ROBOT'
                                        return res.json({ err: 'Not a Human', data: response, body: req.body })
                                    }
                                } else {
                                    return res.json({ err: 'Not a valid token', data: response, body: req.body })
                                }
                            }
                        }
                    }
                })

            } else {
                return res.json({ err: 'Something bad happen', body: req.body })
            }
        } catch (error) {
            return res.json({ err: error, body: req.body })
        }
    }
}