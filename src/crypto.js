const crypto = require('crypto');

const algorithm = process.env.ALGORITHM;
const secretKey = process.env.SECRET_KEY;

const encrypt = (text) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (encryptedPassword) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(encryptedPassword.iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(encryptedPassword.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};