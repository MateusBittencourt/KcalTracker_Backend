import {
    getHistory,
    addHistory,
    removeHistory
} from "./history.js";

export const getHistory_handler = async (req, res) => {
    const { accessToken, date } = req.body
    if (
        accessToken == undefined ||
        date == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    const history = await getHistory(accessToken, date)
    return res.send(history);
};

export const addHistory_handler = async (req, res) => {
    const { accessToken, foodId, weight, meal, date } = req.body
    if (
        accessToken == undefined ||
        foodId == undefined ||
        weight == undefined ||
        meal == undefined ||
        date == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    await addHistory(accessToken, foodId, weight, meal, date);
    return res.send("OK");
};

export const removeHistory_handler = async (req, res) => {
    const { accessToken, historyId } = req.body
    if (
        accessToken == undefined ||
        historyId == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    await removeHistory(accessToken, historyId);
    return res.send("OK");
};
