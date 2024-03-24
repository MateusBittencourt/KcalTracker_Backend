import { request } from './mssqlConector.js'
import { updateAccess } from './access.js'

/**
 * Get the history of the user.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {string} date - The date of the history.
 * @returns {Object} The history of the user.
 */
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
    const response =  await request(query);
    updateAccess(accessToken);
    return response.recordset
}

/**
 * Add the history of the user.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {string} foodId - The food id.
 * @param {number} weight - The weight of the food.
 * @param {string} type - The type of meal.
 * @param {string} date - The date of the meal.
 * @returns {boolean} True if the history is added.
 */
export const addHistory = async (accessToken, foodId, weight, type, date) => {
    const query = `INSERT
    INTO dbo.history (userId, foodId, weight, type, date)
    VALUES ((
        SELECT dbo.access.userId
        FROM dbo.access
        WHERE dbo.access.accessToken = '${accessToken}'
    ), ${foodId}, ${weight}, '${type}', '${date}')`;
    const response =  await request(query);
    updateAccess(accessToken);
    return response;
}

/**
 * Remove the history of the user.
 * 
 * @param {string} historyId - The history id.
 */
export const removeHistory = async (historyId) => {
    const query = `DELETE
        From dbo.history
        WHERE id=${historyId}`;
    return await request(query);
}
