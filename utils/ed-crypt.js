const crypto = require("crypto");
require('dotenv').config();


function makeVector(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *  charactersLength));}
   return result;
}

const algorithm = process.env.ALGO; 
const initVector = makeVector(16);
const Securitykey = process.env.KEY;

const encrypt = (msg) => {
    const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
    let encryptedData = cipher.update(msg, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return {
        vec: encryptedData,
        ad: initVector
    };
}

const decrypt = (hash, ad) => {
    const decipher = crypto.createDecipheriv(algorithm, Securitykey, ad);
    let decryptedData = decipher.update(hash, "hex", "utf-8");
    decryptedData += decipher.final("utf8");
    return decryptedData
}


module.exports = { encrypt, decrypt }