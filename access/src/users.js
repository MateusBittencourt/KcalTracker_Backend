import { accessSql } from '@kcaltracker/storage'
import { sendToken } from './utils/emailer.js';
import { createHash, comparePassword } from './utils/password.js';
import { EventEmitter } from'node:events';
import { v4 as uuidv4 } from 'uuid';
import { channels, publish } from '@kcaltracker/broker';

export const myEmitter = new EventEmitter();

/**
 * Creates a new user.
 * 
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Object} Reply object.
 */
export const createUser = async (username, email, password) => {
    let reply = {};
    if (await accessSql.getUser(username) != undefined){
        reply.statusCode = 400;
        reply.response = 'username unavailable';
    } else if (await getUser(email) != undefined){
        reply.statusCode = 400;
        reply.response = 'email already registered';
    } else {
        const hash = createHash(password);
        reply.statusCode = 200
        await accessSql.createUser(username, email, hash)
        const accessToken = uuidv4(); 
        reply.response = { accessToken }
    }
    return reply;
};

/**
 * Logs in a user.
 * 
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Object} Reply object.
 */
export const login = async (username, password) => {
    const user = await accessSql.getUser(username);
    if (user != undefined){
        if (comparePassword(password, user.hash)){
            const accessToken = uuidv4();
            await accessSql.createAccess(user.id, accessToken);
            publish(accessToken, channels.accessService, 'event');
            return { accessToken }
        }
    }
    return false;
};

/**
 * Logs in a user by token.
 * 
 * @param {string} accessToken - The access token.
 * @returns {Object} Reply object.
 */
export const loginByToken = async (accessToken) => {
    const user = await accessSql.getUserByToken(accessToken);
    if (user != undefined){
        return { accessToken }
    }
    return false;
};

/**
 * Logs out a user.
 * 
 * @param {string} accessToken - The access token.
 * @returns {boolean} True if the user was logged out.
 */
export const logout = async (accessToken) => {
    return !!(await accessSql.removeAccess(accessToken));
}

/**
 * Password change.
 * 
 * @param {string} username - The username of the user.
 * @param {string} currentPassword - The current password of the user.
 * @param {string} newPassword - The new password of the user.
 * @returns {boolean} True if the password was changed.
 */
export const passwordChange = async (username, currentPassword, newPassword) => {
    const user = await accessSql.getUser(username);
    if (user != undefined){
        if (comparePassword(currentPassword, user.hash)){
            const hash = createHash(newPassword);
            try {
                if(await accessSql.changePassword(username, hash) == 1){
                    return true
                }
            } catch {
                return false;
            }
        }
    }
    return false;
};

/**
 * Recovers a password.
 * 
 * @param {string} email - The email of the user.
 */
export const passwordRecovery = async (email) => {
    const user = await accessSql.getUser(email);
    if (user != undefined){
        const token = uuidv4(); 
        sendToken(email, token)
        myEmitter.once(token, async (password, cancel = false) => {
            if(!cancel){
                const hash = createHash(password);
                try {
                    if(await accessSql.changePassword(email, hash) == 1){
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
