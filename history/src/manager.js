import { historySql } from '@kcaltracker/storage'
import { channels, publish } from '@kcaltracker/broker';

////////////////////////////////////////
/// Private functions
////////////////////////////////////////

/**
 * Create a history event.
 * 
 * @param {Object} history - The history object.
 * @returns {Object} The history event.
 */
const historyEvent = (history) => {
    return {
        service: 'history',
        event: {
            type: 'event',
            data: { history }
        }
    };
}


////////////////////////////////////////
/// Public functions
////////////////////////////////////////

/**
 * Get the history of the user.
 * 
 * @param {string} accessToken - The access token of the user.
 * @param {string} date - The date of the history.
 * @returns {Object} The history of the user.
 */
export const getHistory = async (accessToken, date) => {
    const history = await historySql.getHistory(accessToken, date)
    publish(historyEvent(history), channels.historyService)
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
