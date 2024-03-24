import { historySql } from '@kcaltracker/storage'

/**
 * Get the history of the user.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {string} date - The date of the history.
 * @returns {Object} The history of the user.
 */
export const getHistory = async (accessToken, date) => {
    return await historySql.getHistory(accessToken, date)
};

/**
 * Add the history of the user.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {string} foodId - The food id.
 * @param {number} weight - The weight of the food.
 * @param {string} meal - The type of meal.
 * @param {string} date - The date of the meal.
 * @returns {boolean} True if the history is added.
 */
export const addHistory = async (accessToken, foodId, weight, meal, date) => {
    await historySql.addHistory(accessToken, foodId, weight, meal, date)
    return true 
};

/**
 * Remove the history of the user.
 * 
 * @param {string} token - The access token of the user.
 * @param {string} historyId - The history id.
 */
export const removeHistory = async (token, historyId) => {
    await historySql.removeHistory(historyId);
};
