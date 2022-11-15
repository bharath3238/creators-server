const staffModel = require("../models/staff");
const { studentModel } = require("../models/student");
const { decrypt, encrypt } = require("../utils/ed-crypt");


const getStudentDetailsPrinciple = async(req, res) => {
    const {batch, branch} = req.params;
    const {email} = req.body;
    try {
        await staffModel.findOne({email: email}).then(async(staff) => {
            if(staff != null){
                await studentModel.find({batch: batch, branch: branch}).then((users) => {
                    if(users != []){
                        users.map((user) => {
                            user.password = "";
                            user.phone = decrypt(user.phone.vec, user.phone.ad);
                        })
                        res.status(200).json({"students": users});
                    }else{
                        res.status(404).json({"msg":"No results found"})
                    }
                })
            }else{
                res.status(404).json({"msg":"No results found"})
            }
        })
    } catch (error) {
        console.log(error)
        res.status(403).json({"msg":"Invalid Batch details"})
    }
}

const getStudentDetailsBranch = async(req, res) => {
    const {batch} = req.params;
    const {email} = req.body;
    try {
        await staffModel.findOne({email: email}).then(async(staff) => {
            if(staff != null){
                await studentModel.find({batch: batch, branch: staff.branch}).then((users) => {
                    if(users != []){
                        users.map((user) => {
                            user.password = "";
                            user.phone = decrypt(user.phone.vec, user.phone.ad);
                        })
                        res.status(200).json({"students": users});
                    }else{
                        res.status(404).json({"msg":"No results found"})
                    }
                })
            }else{
                res.status(404).json({"msg":"No results found"})
            }
        })
    } catch (error) {
        console.log(error)
        res.status(403).json({"msg":"Invalid Batch details"})
    }
}

const getProfile = async(req, res) => {
    const {email} = req.body;
    try {
        await studentModel.findOne({email: email}).then((user) => {
            if(user != null){
                user.password = " ";
                user.phone = decrypt(user.phone.vec, user.phone.ad);
                res.status(200).json({"user": user});
            }else{
                res.status(404).json({"msg":"not found"});
            }
        })
    } catch (error) {
        console.log(error)
        res.status(403).json({"msg":"Invalid Student details"})
    }
}

const updateProfile = async(req, res) => {
    const {username, newemail, phone, pin, branch, batch, code} = req.body;
    const {id} = req.params;
    try {
        await studentModel.findByIdAndUpdate(id, {
            username:username, email:newemail, phone:encrypt(phone), pin:pin, branch:branch, batch:batch, institute:code
        }).then(() => {
            res.status(200).json({"msg":"updated successfully"});
        })
    } catch (error) {
        res.status(403).json({"msg":"Invalid Student details"})
    }
}

const addNewDetails = async(req, res) => {
    const {email, studentdata} = req.body;
    try {
        await studentModel.findOneAndUpdate({email: email}, {details:studentdata}).then(() => {
            res.status(200).json({"msg":"updated successfully"});
        })
    } catch (error) {
        res.status(403).json({"msg":"Invalid Student details"})
    }
}

const deleteAccount = async(req, res) => {
    const {id} = req.params;
    try {
        await studentModel.findByIdAndDelete(id).then(() => {
            res.status(200).json({"msg":"deleted successfully"});
        })
    } catch (error) {
        res.status(403).json({"msg":"Invalid Student details"})
    }
}

module.exports = {getStudentDetailsPrinciple, getStudentDetailsBranch, getProfile, updateProfile, addNewDetails, deleteAccount};