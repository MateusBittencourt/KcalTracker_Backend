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

export const createUser = async (username, email, hash) => {
    const query = `INSERT
        INTO dbo.users (username, email, hash, lastUpdated)
        VALUES('${username}', '${email}', '${hash}', GETDATE())`;
    return await sqlConnector(query);
};

export const getUser = async (matchBy) => {
    const query = `SELECT *
        FROM dbo.users
        WHERE username='${matchBy}' or email='${matchBy}'`;
    const response =  await sqlConnector(query);
    return response.recordset[0]
}

export const getUserByToken = async (accessToken) => {
    const query = `SELECT dbo.users.*
    FROM dbo.users
    JOIN dbo.access ON dbo.users.id = dbo.access.userId
    WHERE dbo.access.accessToken='${accessToken}'`;
    const response =  await sqlConnector(query);
    updateAccess(accessToken);
    return response.recordset[0];
}

export const createAccess = async (userId, accessToken) => {
    const query = `INSERT 
    INTO dbo.access (userId, accessToken, firstUse, lastUse)
    VALUES (${userId}, '${accessToken}', GETDATE(), GETDATE())`;
    return await sqlConnector(query);
}

export const updateAccess = async (accessToken) => {
    const query = `UPDATE dbo.access
    SET lastUse = GETDATE()
    WHERE accessToken='${accessToken}'`;
    const response =  await sqlConnector(query);
    return response;
}

export const removeAccess = async (accessToken) => {
    const query = `DELETE
    FROM dbo.access
    WHERE accessToken='${accessToken}'`;
    return await sqlConnector(query);
}

export const removeAllAccess = async (accessToken) => {
    const query = `DELETE
    FROM dbo.access
    WHERE userId=(
        SELECT userId
        FROM dbo.access
        WHERE accessToken='${accessToken}')
    AND accessToken!='${accessToken}'`;
    return await sqlConnector(query);
}

export const expireAccess = async () => {
    const query = `DELETE
    FROM dbo.access
    WHERE lastUse < DATEADD(day, -1, GETDATE())`;
    const response =  await sqlConnector(query);
    console.dir(response);
    return response;
}

export const changePassword = async (matchBy, hash) => {
    const query = `UPDATE dbo.users
        SET hash = '${hash}',
        lastUpdated = GETDATE()
        WHERE username='${matchBy}' or email='${matchBy}'`;
    const response =  await sqlConnector(query);
    return response.rowsAffected[0]
}

export const getHistory = async (accessToken, date) => {
    const query = `SELECT
        dbo.history.weight,
        dbo.taco.kcal,
        dbo.taco.description,
        dbo.taco.foodGroup,
        dbo.history.type
    FROM dbo.users
    JOIN dbo.history ON dbo.users.id = dbo.history.userId
    JOIN dbo.access ON dbo.users.id = dbo.access.userId
    JOIN dbo.taco ON dbo.history.foodId = dbo.taco.id
    WHERE dbo.access.accessToken = '${accessToken}'
    AND dbo.history.date = '${date}'`;
    const response =  await sqlConnector(query);
    updateAccess(accessToken);
    return response.recordset
}

export const addHistory = async (accessToken, foodId, weight, type, date) => {
    const query = `INSERT
    INTO dbo.history (userId, foodId, weight, type, date)
    VALUES ((
        SELECT dbo.access.userId
        FROM dbo.access
        WHERE dbo.access.accessToken = '${accessToken}'
    ), ${foodId}, ${weight}, '${type}', '${date})`;
    const response =  await sqlConnector(query);
    updateAccess(accessToken);
    return response;
}

export const removeHistory = async (historyId) => {
    const query = `DELETE
        From dbo.history
        WHERE id='${historyId}'`;
    return await sqlConnector(query);
}

setInterval(expireAccess, 60*60*1000);