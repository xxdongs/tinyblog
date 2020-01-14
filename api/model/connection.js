const mysql = require('mysql');
const logger = require('../util/log');
const config = require('../util/config')

const pool = mysql.createPool(config.db)

class Connection {

    static query(sql, sqlParams) {
        return new Promise((resolve, reject) => {
            pool.query(sql, sqlParams, (queryError, results, fields) => {
                if (queryError) {
                    let err = `DBError: ${queryError.message}`
                    logger.error(err)
                    if (config.isDev) console.log(err)
                    resolve(null)
                    return
                }
                resolve(results)
                if (config.isDev) console.log("querying")
            })
        })
    }
}

module.exports = Connection