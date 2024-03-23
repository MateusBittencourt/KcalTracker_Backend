import {
    createUser as sql_createUser,
    changePassword as sql_changePasword,
    setName as setName_sql,
    setGoal as setGoal_sql,
    setWeight as setWeight_sql,
    setHeight as setHeight_sql,
    getUser,
    getUserByToken,
    removeAccess,
    createAccess
} from '@kcaltracker/storage'
import { sendToken } from './utils/emailer.js';
import { createHash, comparePassword } from './utils/password.js';
import { EventEmitter } from'node:events';
import { v4 as uuidv4 } from 'uuid';

export const myEmitter = new EventEmitter();


export const createUser = async (username, email, password) => {
    let reply = {};
    if (await getUser(username) != undefined){
        reply.statusCode = 400;
        reply.response = 'username unavailable';
    } else if (await getUser(email) != undefined){
        reply.statusCode = 400;
        reply.response = 'email already registered';
    } else {
        const hash = createHash(password);
        reply.statusCode = 200
        await sql_createUser(username, email, hash)
        const user = await getUser(username);
        const accessToken = uuidv4(); 
        reply.response = {
            username: user.username,
            email: user.email,
            accessToken,
            name: user.name,
            goal: user.goal,
            weight: user.weight,
            height: user.height
        }
    }
    return reply;
};

export const login = async (username, password) => {
    const user = await getUser(username);
    if (user != undefined){
        if (comparePassword(password, user.hash)){
            const accessToken = uuidv4();
            await createAccess(user.id, accessToken);
            return {
                username: user.username,
                email: user.email,
                accessToken,
                name: user.name,
                goal: user.goal,
                weight: user.weight,
                height: user.height
            }
        }
    }
    return false;
};

export const loginByToken = async (accessToken) => {
    const user = await getUserByToken(accessToken);
    if (user != undefined){
        return {
            username: user.username,
            email: user.email,
            accessToken,
            name: user.name,
            goal: user.goal,
            weight: user.weight,
            height: user.height
        }
    }
    return false;
};

export const logout = async (accessToken) => {
    return !!(await removeAccess(accessToken));
}

export const passwordChange = async (username, currentPassword, newPassword) => {
    const user = await getUser(username);
    if (user != undefined){
        if (comparePassword(currentPassword, user.hash)){
            const hash = createHash(newPassword);
            try {
                if(await sql_changePasword(username, hash) == 1){
                    return true
                }
            } catch {
                return false;
            }
        }
    }
    return false;
};

export const passwordRecovery = async (email) => {
    const user = await getUser(email);
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

export const setName = async (accessToken, name) => {
    return await setName_sql(accessToken, name);
};

export const getName = async (accessToken) => {
    const user = await getUserByToken(accessToken);
    return { name: user.name };
};

export const setGoal = async (accessToken, goal) => {
    return await setGoal_sql(accessToken, goal);
};

export const getGoal = async (accessToken) => {
    const user = await getUserByToken(accessToken);
    return { goal: user.goal };
};

export const setWeight = async (accessToken, weight) => {
    return await setWeight_sql(accessToken, weight);
};

export const getWeight = async (accessToken) => {
    const user = await getUserByToken(accessToken);
    return { weight: user.weight };
};

export const setHeight = async (accessToken, height) => {
    return await setHeight_sql(accessToken, height);
};

export const getHeight = async (accessToken) => {
    const user = await getUserByToken(accessToken);
    return { height: user.height };
};
