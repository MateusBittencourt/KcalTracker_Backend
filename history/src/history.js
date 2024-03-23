import {
    getHistory as getHistory_sql,
    addHistory as addHistory_sql,
    removeHistory as removeHistory_sql
} from '@kcaltracker/storage'

export const getHistory = async (accessToken, date) => {
    return await getHistory_sql(accessToken, date)
};

export const addHistory = async (accessToken, foodId, weight, meal, date) => {
    await addHistory_sql(accessToken, foodId, weight, meal, date)
    return true 
};

export const removeHistory = async (token, historyId) => {
    await removeHistory_sql(historyId);
};