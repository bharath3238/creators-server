const jwt = require("jsonwebtoken");
const staffModel = require("../models/staff");
require('dotenv').config();


const JWT_SALT = process.env.JWT_SALT


const roleMiddleware = {
    principleRole : async(req, res, next) => {
        const {token} = req.headers;
        try {
            const email = jwt.decode(token, JWT_SALT)
            await staffModel.findOne({email: email}).then((user) => {
                if(user != null && user.role === "Principle"){
                    req.body.email = email;
                    next();
                }else{
                    console.log("inv cred")
                    res.status(403).json({"msg":"Invalid credintials"})
                }
            })
        } catch (error) {
            console.log("auth")
            res.status(403).json({"msg":"You are not authorized to enter"})      
        }
    },
    hodRole : async(req, res, next) => {
        const {token} = req.headers;
        try {
            const email = jwt.decode(token, JWT_SALT)
            await staffModel.findOne({email: email}).then((user) => {
                if(user != null && user.role === "HOD"){
                    req.body.email = email;
                    next();
                }else{
                    res.status(403).json({"msg":"Invalid credintials"})
                }
            })
        } catch (error) {
            res.status(403).json({"msg":"You are not authorized to enter"})      
        }
    },
    staffRole : async(req, res, next) => {
        const {token} = req.headers;
        try {
            const email = jwt.decode(token, JWT_SALT)
            await staffModel.findOne({email: email}).then((user) => {
                if(user != null && user.role === "Staff"){
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
}

module.exports = { roleMiddleware}