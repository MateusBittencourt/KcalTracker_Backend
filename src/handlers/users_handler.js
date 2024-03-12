import {
    createUser,
    loginUser,
    passwordRecovery,
    passwordChange,
    myEmitter
} from "../users.js";

export const createUser_handler = async (req, res) => {
    const { username, email, password } = req.body
    if (
        username == undefined ||
        email == undefined ||
        password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    const reply = await createUser(username, email, password)
    return res.status(reply.statusCode).send(reply.response);
};

export const loginUser_handler = async (req, res) => {
    const { username, password } = req.body
    if (
        username == undefined ||
        password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
        const user = await loginUser(username, password)
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

export const passwordChange_handler = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body
    if (
        username == undefined ||
        currentPassword == undefined ||
        newPassword == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    return res.send(await passwordChange(username, currentPassword, newPassword));
};

export const passwordRecovery_handler = async (req, res) => {
    const { email } = req.body

    if ( email == undefined ){
        return res.status(400).send("Missing required fields");
    }
    passwordRecovery(email)
    return res.send();
};

export const passwordInputToken_handler = async (req, res) => {
    const { token, password } = req.body

    if ( token == undefined ){
        return res.status(400).send("Missing required fields");
    }
    myEmitter.emit(token, password);
    myEmitter.once(`${token}-B`, (cancel = false) => {
        return res.send(!cancel);
    });
};

export const logoutUser_handler = async (req, res) => {
    res.send({createUser: "This is an createUser"});
};