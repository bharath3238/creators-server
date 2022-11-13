const jwt = require("jsonwebtoken");
const staffModel = require("../models/staff");
const { studentModel } = require("../models/student");
require('dotenv').config();


const JWT_SALT = process.env.JWT_SALT
const tokenMiddleware = async (req, res, next) => {
    const {token} = req.headers;
    try {
        const email = jwt.decode(token, JWT_SALT)
        await staffModel.findOne({email: email}).then((user) => {
            if(user != null){
                req.body.email = email;
                next();
            }else{
                res.status(403).json({"msg":"Invalid credintials"})
            }
        })
    } catch (error) {
        res.status(403).json({"msg":"You are not authorized to enter"})      
    }
}

const studentTokenMiddleware = async (req, res, next) => {
    const {token} = req.headers;
    try {
        const email = jwt.decode(token, JWT_SALT)
        await studentModel.find({email: email}).then((user) => {
            if(user != null){
                req.body.email = email;
                next();
            }else{
                res.status(403).json({"msg":"Invalid credintials"})
            }
        })
    } catch (error) {
        res.status(403).json({"msg":"You are not authorized to enter"})      
    }
}

module.exports = { tokenMiddleware, studentTokenMiddleware}