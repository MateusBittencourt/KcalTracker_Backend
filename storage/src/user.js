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
 * Set the name of the user.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {string} name - The name of the user.
 * @returns {boolean} True if the user's name is changed.
 */
export const setName = async (accessToken, name) => {
    const query = `UPDATE dbo.users
    SET name = '${name}',
        lastUpdated = GETDATE()
    WHERE dbo.users.id = (
        SELECT userId
        FROM dbo.access
        WHERE accessToken='${accessToken}')`;
    const response =  await request(query);
    updateAccess(accessToken);
    return response.rowsAffected[0];
}

/**
 * Set the user weight loss goal.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {number} goal - The goal of the user.
 * @returns {boolean} True if the user's goal is changed.
 */
export const setGoal = async (accessToken, goal) => {
    const query = `UPDATE dbo.users
    SET goal = ${goal},
        lastUpdated = GETDATE()
    WHERE dbo.users.id = (
        SELECT userId
        FROM dbo.access
        WHERE accessToken='${accessToken}')`;
    const response =  await request(query);
    updateAccess(accessToken);
    return response.rowsAffected[0];
}

/**
 * Set the user weight.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {number} weight - The weight of the user.
 * @returns {boolean} True if the user's weight is changed.
 */
export const setWeight = async (accessToken, weight) => {
    const query = `UPDATE dbo.users
    SET weight = ${weight},
        lastUpdated = GETDATE()
    WHERE dbo.users.id = (
        SELECT userId
        FROM dbo.access
        WHERE accessToken='${accessToken}')`;
    const response =  await request(query);
    updateAccess(accessToken);
    return response.rowsAffected[0];
}

/**
 * Set the user height.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {number} height - The height of the user.
 * @returns {boolean} True if the user's height is changed.
 */
export const setHeight = async (accessToken, height) => {
    const query = `UPDATE dbo.users
    SET height = ${height},
        lastUpdated = GETDATE()
    WHERE dbo.users.id = (
        SELECT userId
        FROM dbo.access
        WHERE accessToken='${accessToken}')`;
    const response =  await request(query);
    updateAccess(accessToken);
    return response.rowsAffected[0];
}
