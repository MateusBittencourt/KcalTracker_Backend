import sql from 'mssql'

// Load environment variables
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_SRVR,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

/**
 * Execute the query.
 * 
 * @param {string} query - The query to execute.
 * @returns {Object} The result of the query.
 */
export const request = async (query) => {
    try {      
        const result = sql.connect(sqlConfig).then((pool) => {
            return pool.query(query)
        });
        return result;
    } catch (err) {
        return err
    }
}