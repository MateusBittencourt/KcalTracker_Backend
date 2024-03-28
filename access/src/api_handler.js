import {
    createUser,
    login,
    loginByToken,
    logout,
    passwordRecovery,
    passwordChange,
    myEmitter
} from "./manager.js";

/**
 * Creates a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
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

/**
 * Logs in a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
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

/**
 * Logs in a user by token.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
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

/**
 * Logs out a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
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
};

/**
 * Changes the password of a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
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

/**
 * Recovers the password of a user.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
export const passwordRecovery_handler = async (req, res) => {
    const { email } = req.body;

    if ( email == undefined ){
        return res.status(400).send("Missing required fields");
    }
    passwordRecovery(email)
    return res.send();
};

/**
 * Changes the password of a user by token.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object.
 */
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
