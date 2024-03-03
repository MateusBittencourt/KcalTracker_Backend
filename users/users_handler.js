import {
    createUser as sql_createUser,
    lookUpUser
} from '../sqlConnector.js'
import { createHash, comparePassword } from './password.js'

export const createUser = async (data) => {
    const hash = createHash(data.password);
    return await sql_createUser(data.username, data.email, hash);
}

export const loginUser = async (data) => {
    const user = await lookUpUser(data.username);
    if (user == undefined){
        return false
    }
    return comparePassword(data.password, user.hash)
}

