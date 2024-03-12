import {
    getHistory,
    addHistory,
    removeHistory
} from "../history.js";

export const getHistory_handler = async (req, res) => {
    const { token, date } = req.body
    if (
        token == undefined ||
        date == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    const history = await getHistory(token, date)
    return res.send("OK");
};

export const addHistory_handler = async (req, res) => {
    const { token, foodId, weight, meal, date } = req.body
    if (
        token == undefined ||
        foodId == undefined ||
        weight == undefined ||
        meal == undefined ||
        date == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    await addHistory(token, foodId, weight, meal, date);
    return res.send("OK");
};

export const removeHistory_handler = async (req, res) => {
    const { token, historyId } = req.body
    if (
        token == undefined ||
        historyId == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    await removeHistory(token, historyId);
    return res.send("OK");
};
