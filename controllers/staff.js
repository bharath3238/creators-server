const staffModel = require("../models/staff");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {encrypt, decrypt} = require("../utils/ed-crypt");

const JWT_SALT = process.env.JWT_SALT

const checkUP = async(req, res) => {
    const {username, password} = req.body;
    const name = process.env.ADMINAME
    const vac = process.env.VAC 
    const ad = process.env.AD 
    try {
        if(username == name){
            await bcrypt.compare(password, decrypt(vac, ad)).then((stat) => {
                if(stat){
                    res.status(200).json({"msg":"Logged in", "token": jwt.sign(username, JWT_SALT)})
                }else{
                    res.status(403).json({"msg":"Invalid Username or Password"})
                }
            })
        }else{
            res.status(403).json({"msg":"Invalid Username or Password"})
        }
    } catch (error) {
        res.status(400).json({"msg":"Invalid Credintials"})
    }
}

const register = async(req, res) => {
    const {username, password, email, role, phone, branch, institute} = req.body;
    const hashpass = await bcrypt.hash(password, 12);
    try {
        await staffModel.findOne({email: email}).then((user) => {
            if(user == null){
                const newStaff = new staffModel({
                    username, password: encrypt(hashpass), email, role, phone: encrypt(phone), branch, institute
                })
                newStaff.save().then(() => {
                    res.status(200).json({"msg":"Staff account created"})
                })
            }else{
                res.status(400).json({"msg":"User with this email already exists"})
            }
        })
    } catch (error) {
        res.status(400).json({"msg":"Invalid Credintials"})
    }
}


module.exports = {checkUP, register}