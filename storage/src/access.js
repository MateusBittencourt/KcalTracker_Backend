import { request } from './mssqlConector.js'

/**
 * Create a new user.
 * 
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} hash - The hash of the password.
 * @returns {boolean} True if the user is created.
 */
export const createUser = async (username, email, hash) => {
    const query = `INSERT
        INTO dbo.users (username, email, hash, lastUpdated)
        VALUES('${username}', '${email}', '${hash}', GETDATE())`;
    return await request(query);
};

/**
 * Change the password of the user.
 * 
 * @param {string} matchBy - The username or email of the user.
 * @param {string} hash - The hash of the password.
 * @returns {boolean} True if the user is created.
 */
export const changePassword = async (matchBy, hash) => {
    const query = `UPDATE dbo.users
        SET hash = '${hash}',
            lastUpdated = GETDATE()
        WHERE username='${matchBy}' or email='${matchBy}'`;
    const response =  await request(query);
    return response.rowsAffected[0]
}

/**
 * Get the user.
 * 
 * @param {string} matchBy - The username or email of the user.
 * @returns {Object} The user.
 */
export const getUser = async (matchBy) => {
    const query = `SELECT *
        FROM dbo.users
        WHERE username='${matchBy}' or email='${matchBy}'`;
    const response =  await request(query);
    return response.recordset[0]
}

/**
 * Get the user by the access token.
 * 
 * @param {string} accessToken - The access token of the user.
 * @returns {Object} The user.
 */
export const getUserByToken = async (accessToken) => {
    const query = `SELECT dbo.users.*
    FROM dbo.users
    JOIN dbo.access ON dbo.users.id = dbo.access.userId
    WHERE dbo.access.accessToken='${accessToken}'`;
    const response =  await request(query);
    updateAccess(accessToken);
    return response.recordset[0];
}

/**
 * Create a new access history.
 * 
 * @param {string} userId - The id of the user.
 * @param {string} accessToken - The access token.
 * @returns {boolean} True if the access is created.
 */
export const createAccess = async (userId, accessToken) => {
    const query = `INSERT 
    INTO dbo.access (userId, accessToken, firstUse, lastUse)
    VALUES (${userId}, '${accessToken}', GETDATE(), GETDATE())`;
    return await request(query);
}

/**
 * Update the access history.
 * 
 * @param {string} accessToken - The access token.
 * @returns {boolean} True if the access is updated.
 */
export const updateAccess = async (accessToken) => {
    const query = `UPDATE dbo.access
    SET lastUse = GETDATE()
    WHERE accessToken='${accessToken}'`;
    const response =  await request(query);
    return response;
}

/**
 * Remove the access history.
 * 
 * @param {string} accessToken - The access token.
 * @returns {boolean} True if the access is removed.
 */
export const removeAccess = async (accessToken) => {
    const query = `DELETE
    FROM dbo.access
    WHERE accessToken='${accessToken}'`;
    return await request(query);
}

/**
 * Remove all the access history.
 * 
 * @param {string} accessToken - The access token.
 * @returns {boolean} True if the access is removed.
 */
export const removeAllAccess = async (accessToken) => {
    const query = `DELETE
    FROM dbo.access
    WHERE userId=(
        SELECT userId
        FROM dbo.access
        WHERE accessToken='${accessToken}')
    AND accessToken!='${accessToken}'`;
    return await request(query);
}

/**
 * Expire the access history.
 * 
 * @returns {Object} The result of the query.
 */
export const expireAccess = async () => {
    const query = `DELETE
    FROM dbo.access
    WHERE lastUse < DATEADD(day, -1, GETDATE())`;
    const response =  await request(query);
    console.dir(response);
    return response;
}

