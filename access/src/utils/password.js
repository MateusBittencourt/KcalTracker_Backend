import bcrypt from 'bcryptjs';
 
/**
* Create a hash from a password
* 
* @param {string} password - The password to hash.
* @returns {string} The hash of the password.
*/
export const createHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt)
    return hash
};

/**
 * Compare a password with a hash.
 * 
 * @param {string} password - The password to compare.
 * @param {string} hash - The hash to compare.
 * @returns {boolean} True if the password matches the hash.
 */
export const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};