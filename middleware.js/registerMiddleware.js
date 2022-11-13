const jwt = require("jsonwebtoken")
require("dotenv").config();

const JWT_SALT = process.env.JWT_SALT
const RegisterMiddleware = (req, res, next) => {
    const name = process.env.ADMINAME;
    console.log(name)
    const {token} = req.headers;
    try {
        if(name ===  jwt.decode(token, JWT_SALT)){
            next();
        }else{
            res.status(403).json({"msg":"Invalid Creds, please try logging in again"})      
        }
    } catch (error) {
        res.status(403).json({"msg":"You are not authorized to enter"})      
    }
}

module.exports = {RegisterMiddleware}