import {
    createUser as handler_createUser,
    loginUser as handler_loginUser,
    passwordRecovery as handler_passwordRecovery,
    passwordChange as handler_passwordChange,
    myEmitter
} from "../users_handler.js";

export const createUser = async (req, res) => {
    const { username, email, password } = req.body
    if (
        username == undefined ||
        email == undefined ||
        password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    const reply = await handler_createUser(username, email, password)
    return res.status(reply.statusCode).send(reply.response);
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body
    if (
        username == undefined ||
        password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
        const user = await handler_loginUser(username, password)
    if (user){
        res.header('X-Rate-Limit', 3);
        res.header('X-Rate-Limit', 3);
        let date = new Date();
        date.setDate(date.getDate() + 1);
        res.header('X-Expires-After', date);
        return res.send(user)
    }
    return res.status(400).send("Wrong Username/email or Password");
};

export const passwordChange = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body
    if (
        username == undefined ||
        currentPassword == undefined ||
        newPassword == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    return res.send(await handler_passwordChange(username, currentPassword, newPassword));
};

export const passwordRecovery = async (req, res) => {
    const { email } = req.body

    if ( email == undefined ){
        return res.status(400).send("Missing required fields");
    }
    handler_passwordRecovery(email)
    return res.send();
};

export const passwordInputToken = async (req, res) => {
    const { token, password } = req.body

    if ( token == undefined ){
        return res.status(400).send("Missing required fields");
    }
    myEmitter.emit(token, password);
    myEmitter.once(`${token}-B`, (cancel = false) => {
        return res.send(!cancel);
    });
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

