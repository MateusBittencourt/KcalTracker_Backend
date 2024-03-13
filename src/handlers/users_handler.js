import {
    createUser,
    login,
    loginByToken,
    logout,
    passwordRecovery,
    passwordChange,
    myEmitter
} from "../users.js";

export const createUser_handler = async (req, res) => {
    const { username, email, password } = req.body;
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

export const login_handler = async (req, res) => {
    const { username, password } = req.body;
    if (
        username == undefined ||
        password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
        const user = await login(username, password)
    if (user){
        return res.send(user)
    }
    return res.status(400).send("Wrong Username/email or Password");
};

export const loginByToken_handler = async (req, res) => {
    const { accessToken } = req.body;
    if (
        accessToken == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    const user = await loginByToken(accessToken)
    if (user){
        return res.send(user);
    }
    return res.status(403).send();
};

export const logout_handler = async (req, res) => {
    const { accessToken } = req.body;
    if (
        accessToken == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    if (await logout(accessToken)){
        return res.status(202).send();
    }
    return res.status(500).send();
}

export const passwordChange_handler = async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
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
    const { email } = req.body;

    if ( email == undefined ){
        return res.status(400).send("Missing required fields");
    }
    passwordRecovery(email)
    return res.send();
};

export const passwordInputToken_handler = async (req, res) => {
    const { validationToken, password } = req.body;

    if ( token == undefined ){
        return res.status(400).send("Missing required fields");
    }
    myEmitter.emit(token, password);
    myEmitter.once(`${token}-B`, (cancel = false) => {
        return res.send(!cancel);
    });
};
