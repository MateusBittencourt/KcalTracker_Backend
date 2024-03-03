import {
    createUser as sql_createUser,
    lookUpUser
} from '../utils/sqlConnector.js'
import { createHash, comparePassword } from '../utils/password.js'

export const createUser = async (req, res) => {
    const { username, email, password } = req.body
    if (
        username == undefined ||
        email == undefined ||
        password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    if (lookUpUser(username) != undefined){
        return res.status(400).send("username unavailable");
    }
    if (lookUpUser(email) != undefined){
        return res.status(400).send("email already registred");
    }
    const hash = createHash(password);
    return res.send(await sql_createUser(username, email, hash));
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body
    if (
        username == undefined ||
        password == undefined
    ){
        return res.status(400).send("Missing required fields");
    }
    const user = await lookUpUser(username);
    if (user != undefined){
        if (comparePassword(password, user.hash)){
            res.header('X-Rate-Limit', 3);
            let date = new Date();
            date.setDate(date.getDate() + 1);
            res.header('X-Expires-After', date);
            return res.send({
                username: user.username,
                email: user.email,
                token: 'ToDo'
            })
        }
    }
    return res.status(400).send("Wrong Username/email or Password");
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