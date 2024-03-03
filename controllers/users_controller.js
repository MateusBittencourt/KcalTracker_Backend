import {
    createUser as createUser_handler,
    loginUser as loginUser_handler
} from "../users/users_handler.js";

export const createUser = async (req, res) => {
    if (
        req.body.username == undefined ||
        req.body.email == undefined ||
        req.body.password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    res.send(await createUser_handler(req.body));
};

export const loginUser = async (req, res) => {
    if (
        req.body.username == undefined ||
        req.body.password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    res.header('X-Rate-Limit', 3);
    let date = new Date();
    date.setDate(date.getDate() + 1);
    res.header('X-Expires-After', date);
    if (await loginUser_handler(req.body)){
        res.send('token');
    } else {
        res.status(400).send("Wrong Username/email or Password");
    }
};

export const logoutUser = async (req, res) => {
    res.send({createUser: "This is an createUser"});
};

export const getUserByName = async (req, res) => {
    res.send({createUser: "This is an createUser"});
};

export const updateUser = async (req, res) => {
    res.send({createUser: "This is an createUser"});
};

export const deleteUser = async (req, res) => {
    res.send({createUser: "This is an createUser"});
};