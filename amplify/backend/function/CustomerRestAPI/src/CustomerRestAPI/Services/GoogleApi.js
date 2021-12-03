const dbConn = require('../config');
const axios = require('axios')


module.exports = {

    getPlaceData: async (req, res) => {
        try {


            if (req.body.placeId) {
                let envQuery = `select * from EnvVariables WHERE name in ('REACT_APP_GOOGLE_ADDRESS_API_KEY');`
                dbConn.query(envQuery, async (err, envVariable) => {
                    if (err) {
                        res.json({ err: err, body: req.body })
                    } else {
                        if (envVariable && envVariable.length > 0) {
                            let Env = {}
                            for (let i = 0; i < envVariable.length; i++) {
                                Env[envVariable[i].name] = envVariable[i].value
                            }

                            let data = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.body.placeId}&key=${Env['REACT_APP_GOOGLE_ADDRESS_API_KEY']}`)

                            let placeData = data.data.result
                            let selectObj = {}
                            let array = ['locality', 'administrative_area_level_2', 'administrative_area_level_1', 'country', 'postal_code']

                            for (let i = 0; i < array.length; i++) {
                                let matchingIndex = placeData.address_components.findIndex(item => item.types && item.types.length > 0 && item.types[0] === array[i])
                                if (matchingIndex > -1) {
                                    let value = placeData.address_components[matchingIndex].long_name
                                    selectObj = {
                                        ...selectObj,
                                        [array[i]]: value
                                    }
                                }
                            }
                            if (placeData && placeData.name) {
                                selectObj.address = placeData.name
                            }
                            return res.json({ success: "Get call succeed!", place: selectObj })
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