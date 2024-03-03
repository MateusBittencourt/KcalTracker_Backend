import sql from 'mssql'

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

const sqlConnector = async (query) => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        await sql.connect(sqlConfig);
        const result = await sql.query(query);
        return result;
    } catch (err) {
        return err
    }
}

export const createUser = async (username, email, hash, salt) => {
    const query = `INSERT
        INTO dbo.users (username, email, hash, lastUpdated)
        VALUES('${username}', '${email}', '${hash}', GETDATE())`;
    return await sqlConnector(query);
};

export const lookUpUser = async (matchBy) => {
    const query = `SELECT *
        FROM dbo.users
        WHERE username='${matchBy}' or email='${matchBy}'`;
    const response =  await sqlConnector(query);
    return response.recordset[0]
}