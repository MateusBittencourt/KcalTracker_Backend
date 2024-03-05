import {
    createUser as sql_createUser,
    changePassword as sql_changePasword,
    lookUpUser
} from './utils/sqlConnector.js'
import { sendToken } from './utils/emailer.js';
import { createHash, comparePassword } from './utils/password.js';
import { EventEmitter } from'node:events';
import { v4 as uuidv4 } from 'uuid';

export const myEmitter = new EventEmitter();


export const createUser = async (username, email, password) => {
    let reply = {
        statusCode,
        response
    };
    
    if (lookUpUser(username) != undefined){
        reply.statusCode = 400;
        reply.response = 'username unavailable';
    } else if (lookUpUser(email) != undefined){
        reply.statusCode = 400;
        reply.response = 'email already registred';
    } else {
        const hash = createHash(password);
        reply.statusCode = 200
        reply.response = await sql_createUser(username, email, hash)
    }
    return reply;
};

export const loginUser = async (username, password) => {
    const user = await lookUpUser(username);
    if (user != undefined){
        if (comparePassword(password, user.hash)){
            return {
                username: user.username,
                email: user.email,
                token: 'ToDo'
            }
        }
    }
    return false;
};


export const changePassword = async (email) => {
    //Todo
};

export const passwordRecovery = async (email) => {
    const user = await lookUpUser(email);
    if (user != undefined){
        const token = uuidv4(); 
        sendToken(email, token)
        myEmitter.once(token, async (password, cancel = false) => {
            if(!cancel){
                const hash = createHash(password);
                try {
                    if(await sql_changePasword(email, hash) == 1){
                        myEmitter.emit(`${token}-B`)
                    } else {
                        myEmitter.emit(`${token}-B`, true)
                    }
                } catch {
                    myEmitter.emit(`${token}-B`, true)
                }
            }
        });
        setTimeout(() => {
            myEmitter.emit(token, null, true)
        }, 21600000)
    }
};