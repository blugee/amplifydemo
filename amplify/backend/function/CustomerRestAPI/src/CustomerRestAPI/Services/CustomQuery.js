const dbConn = require('../config');

module.exports = {

    getColumnsByTableName: async (req, res) => {
        let tableQuery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${req.body.tableName}';  `;

        dbConn.query(tableQuery, async (err, result) => {
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
    },

    saveQuery: async (req, res) => {
        let saveQuery = `insert into CustomerCustomQuery (userId, query, name, filter) values ("${req.body.userId}", "${req.body.query}" , "${req.body.name}" , '${req.body.filter}');  `;

        dbConn.query(saveQuery, async (err, result) => {
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
    },


    getData: async (req, res) => {
        let dataQuery = `${req.body.query} limit ${req.body.page - 1}, ${req.body.size} `;

        dbConn.query(dataQuery, async (err, customQueryData) => {
            if (err) {
                if (err.errno === 1054) {
                    res.json({ err: "requested body field inappropriate", body: req.body })
                } else {
                    res.json({ err: err, body: req.body })
                }
            } else {
                let table = req.body.query.split('from')
                let countQuery = `select count(*) as total from ${table[1]} `;

                dbConn.query(countQuery, async (err, countData) => {
                    if (err) {
                        if (err.errno === 1054) {
                            res.json({ err: "requested body field inappropriate", body: req.body })
                        } else {
                            res.json({ err: err, body: req.body })
                        }
                    } else {

                        res.json({ success: 'post call succeed!', total: countData[0].total, customQueryData: customQueryData, })
                    }
                })
                // res.json({ success: 'post call succeed!',  })
            }
        })
    },

    getQueryByUser: async (req, res) => {
        let dataQuery = `SELECT * FROM CustomerCustomQuery where userId = '${req.body.userId}' limit ${req.body.page - 1}, ${req.body.size}  `;

        dbConn.query(dataQuery, async (err, customQueryData) => {
            if (err) {
                if (err.errno === 1054) {
                    res.json({ err: "requested body field inappropriate", body: req.body })
                } else {
                    res.json({ err: err, body: req.body })
                }
            } else {
                let countQuery = `select count(*) as total from  CustomerCustomQuery where userId = '${req.body.userId}'`;

                dbConn.query(countQuery, async (err, countData) => {
                    if (err) {
                        if (err.errno === 1054) {
                            res.json({ err: "requested body field inappropriate", body: req.body })
                        } else {
                            res.json({ err: err, body: req.body })
                        }
                    } else {

                        res.json({ success: 'post call succeed!', total: countData[0].total, customQueryData: customQueryData, })
                    }
                })
                // res.json({ success: 'post call succeed!', customeQueryData: customeQueryData, })
            }
        })
    },

    deleteCustomQuery: async (req, res) => {
        let dataQuery = `delete from CustomerCustomQuery where id = '${req.body.id}';  `;

        dbConn.query(dataQuery, async (err, customQueryData) => {
            if (err) {
                if (err.errno === 1054) {
                    res.json({ err: "requested body field inappropriate", body: req.body })
                } else {
                    res.json({ err: err, body: req.body })
                }
            } else {
                res.json({ success: 'post call succeed!', customQueryData: customQueryData, })
            }
        })
    }
}