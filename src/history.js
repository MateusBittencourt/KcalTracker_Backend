import {
    getHistory as getHistory_sql,
    addHistory as addHistory_sql
} from './utils/sqlConnector.js'

export const getHistory = async (accessToken, date) => {
    return await getHistory_sql(accessToken, date)
};

export const addHistory = async (accessToken, foodId, weight, meal, date) => {
    console.dir(await addHistory_sql(accessToken, foodId, weight, meal, date))
    return true 
};

export const removeHistory = async (token, historyId) => {
    //ToDo
};