const mysql = require('mysql');
const logger = require('../util/log');
const config = require('../util/config')
const { convertQueryResult } = require('../util/util')

const pool = mysql.createPool(config.db)

class Connection {

    static query(sql, sqlParams) {
        return new Promise((resolve, reject) => {
            pool.getConnection((connectError, connection) => {
                if (connectError) {
                    reject(connectError)
                    return
                }
                let query = connection.query(sql, sqlParams, (queryError, results, fields) => {
                    connection.release()
                    if (queryError) {
                        logger.error(`QueryError: ${queryError.message}`)
                        if (config.isDev) console.log(`QueryError: ${queryError.message}`)
                        resolve(null)
                        return
                    }
                    // convertQueryResult(results)
                    resolve(results)
                })
                if (config.isDev) console.log(query.sql)
            })
        })
    }

    static updateQueryString(source, params) {

    }
}

module.exports = Connection