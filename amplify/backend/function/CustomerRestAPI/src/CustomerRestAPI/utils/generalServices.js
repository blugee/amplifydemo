const dbConn = require('../config');
var ApiContracts = require('authorizenet').APIContracts;


const envService = async (string) => {
    return new Promise(async (resolve) => {

        let envQuery = `select * from EnvVariables WHERE name in (${string});`
        dbConn.query(envQuery, async (err, data) => {
            if (err) {
                console.log('err envQuery >', err)
                res.json({ err: err, body: req.body })
            } else {
                let Env = {}
                for (let i = 0; i < data.length; i++) {
                    Env[data[i].name] = data[i].value
                }

                let matchStr = /REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET/;
                if (matchStr.test(string)) {
                    let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
                    merchantAuthenticationType.setName(Env['REACT_APP_API_LOGIN_KEY_AUTHORIZE_NET'])
                    merchantAuthenticationType.setTransactionKey(Env['REACT_APP_TRANSACTION_KEY_AUTHORIZE_NET'])
                    Env.merchantAuthenticationType = merchantAuthenticationType
                }
                resolve(Env)
            }
        })
    })
}

var services = {
    envService
}

module.exports = services