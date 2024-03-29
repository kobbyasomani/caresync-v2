const crypto = require('crypto');

const pass = process.env.CRYPTO_PASS;
const salt = process.env.CRYPTO_SALT;

// Derive encryption key with PBKDF2
const generateEncryptionKey = async () => {
    crypto.pbkdf2(pass, salt, 100000, 32, 'sha256', (error, derivedKey) => {
        if (error) throw error;
        // console.log(derivedKey.toString('base64'));
        return derivedKey;
    });
}

const encryptionKey = generateEncryptionKey();

module.exports = {
    encryptionKey
}