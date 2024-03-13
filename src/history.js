import {
    getHistory as getHistory_sql
} from './utils/sqlConnector.js'

export const getHistory = async (token, date) => {
    return await getHistory_sql(token, date)
};

export const addHistory = async (token, foodId, weight, meal, date) => {
    //ToDo
};

export const removeHistory = async (token, historyId) => {
    //ToDo
};