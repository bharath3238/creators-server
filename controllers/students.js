const {studentModel, attendanceModel} = require("../models/student");
const { encrypt, decrypt } = require("../utils/ed-crypt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const staffModel = require("../models/staff");
const { GenerateExcel } = require("../utils/generateExcel");
require('dotenv').config();
var path = require('path');
const excelJS = require("exceljs");


const JWT_SALT = process.env.JWT_SALT;

const registerStudent = async (req, res) => {
    const{username, password, email, phone, batch, branch, institute, pin} = req.body;
    console.log(username, password, email, phone, batch, branch, institute, pin);
    const passhash = await bcrypt.hash(password, 12);
    try {
        await studentModel.findOne({email:email, pin:pin}).then((user) => {
            if(user == null){
                new studentModel({
                    username,
                    password: encrypt(passhash),
                    email,
                    phone: encrypt(phone),
                    batch,
                    branch,
                    institute,
                    pin
                }).save().then(() => {
                    res.status(200).json({"msg":"user created successfully", "token": jwt.sign(email, JWT_SALT), "role":"user"})
                })
            }else{
                res.status(400).json({"msg":"User already exists"})
            }
        })
    } catch (error) {
        res.status(400).json({"msg":"Invalid details"})
    }
}

const loginStudent = async(req, res) => {
    const {email, password} = req.body;
    console.log(email, password)
    try {
        await studentModel.findOne({email:email}).then(async(user) => {
            if(user != null){
                bcrypt.compare(password, decrypt(user.password.vec, user.password.ad)).then((resp) => {
                    if(resp){
                        res.status(200).json({"msg":"User logged in", "token":jwt.sign(email, JWT_SALT), "role": "user"})
                    }else{
                        res.status(400).json({"msg":"Invalid Creds"})
                    }
                })
            }else{
                await staffModel.findOne({email:email}).then((staff) => {
                    if(staff != null){
                        res.status(200).json({"msg":"staff logged in", "token":jwt.sign(email, JWT_SALT), "role" : staff.role})
                    }else{
                        res.status(400).json({"msg":"Invalid Creds"})
                    }
                })
            }
        })
    } catch (error) {
        res.status(400).json({"msg":"Invalid details"})
    }
}

const getAllPins = async(req, res) => {
    const {batch} = req.params;
    try {
        let pins = [];
        await studentModel.find({batch:batch}).then((users) => {
            users.map((user) => {
                pins.push(user.pin);
            })
            console.log(pins)
        }).then(() => {
            res.status(200).json({"pins": pins});
        })
    } catch (error) {
        res.status(400).json({"msg":"Invalid Batch details"})
    }
}

const markAttendance = async(req, res) => {
    const {batch} = req.params;
    const {list, date, email} = req.body;
    console.log(list, "list")
    try {
        await staffModel.findOne({email:email}).then(async user => {
            if(user!=null){
                await new attendanceModel({
                    batch: batch, 
                    branch: user.branch,
                    list: list, 
                    date: date,
                    instituteCode : user.institute
                }).save();
            }
        })
        res.status(200).json({"msg": "created today's attendance"})
    } catch (error) {
        console.log(error)
        res.status(400).json({"msg":"Invalid Batch details"})
    }
}

const getAllAttendances = async(req, res) => {
    const {batch} = req.params;
    const {email} = req.body;
    try {
        await staffModel.findOne({email: email}).then(async user => {
            if(user != null){
                await attendanceModel.find({branch: user.branch, batch}).then((models) => {
                    if(models != null){
                        res.status(200).json({"atts": models});
                    }else{
                        res.status(404).json({"msg": "not found"})
                    }
                })
            }
        })
    } catch (error) {
        res.status(400).json({"msg":"Invalid Batch details"})
    }
}

const excelAttendances = async(req, res) => {
    const {date} = req.params;
    const {email} = req.body;
    const shortdate = date.split("T")[0];
    try {
        await staffModel.findOne({email: email}).then(async user => {
            const workbook2 = new excelJS.Workbook();
            const worksheet = workbook2.addWorksheet(shortdate); 
            if(user != null){
                await attendanceModel.findOne({branch: user.branch, date: date}).then((models) => {
                    if(models != null){
                        models.list.forEach(async(code) => {
                            let keys = Object.keys(code);
                            console.log(keys)
                            let newKeys = [];
                            keys.forEach((key) => {
                                newKeys.push({
                                    header: key, key: key, width: 10
                                });
                            })
                            worksheet.columns = newKeys;
                            models.list.forEach((muser) => {
                                worksheet.addRow(muser); 
                                worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };})
                            });

                        })
                    }else{
                        res.status(404).json({"msg": "not found"})
                    }
                })
                try { 
                    let filePath = path.join(__dirname, '..', 'utils', 'temp') 
                    let link = req.protocol + '://' + req.get('host');
                    await workbook2.xlsx.writeFile(`${filePath}/${shortdate}.xlsx`).then(() => {
                        return res.json({"msg":`${link}/student/utils/temp/${shortdate}.xlsx`});
                    })
                }
                catch (err) {    
                    return res.send({status: "error",message: "Something went wrong",  });  }
            }
        })
    } catch (error) {
        res.status(400).json({"msg":"Invalid Batch details"})
    }
}


const studentExcel = async(req, res) => {
    const {batch} = req.params;
    const {email} = req.body;
    try {
        await staffModel.findOne({email: email}).then(async user => {
            if(user != null){
                await studentModel.find({branch: user.branch, batch}).then((models) => {
                    if(models != null){
                        models.forEach(async(result) => {
                            let object = Object.entries(result)[Object.entries(result).length - 1][1];
                            let keys = Object.keys(object);
                            let newKeys = [];
                            keys.forEach((key) => {
                                if(key == '_id'){
                                    return null;
                                }
                                else if(key == '__v'){return null;}
                                else if(key == 'password'){return null;}
                                else{
                                    newKeys.push({
                                        header: key, key: key, width: 10
                                    });
                                }
                            })
                            result.phone = decrypt(result.phone.vec, result.phone.ad);
                            const workbook = new excelJS.Workbook();
                            const worksheet = workbook.addWorksheet("Students"); 
                            worksheet.columns = newKeys;
                                models.forEach((user) => {
                                    worksheet.addRow(user); 
                                    worksheet.getRow(1).eachCell((cell) => {  cell.font = { bold: true };})
                                });

                            try { 
                                let filePath = path.join(__dirname, '..', 'utils', 'temp') 
                                let link = req.protocol + '://' + req.get('host');
                                await workbook.xlsx.writeFile(`${filePath}/${batch}.xlsx`).then(() => {
                                    res.json({"msg":`${link}/student/utils/temp/${batch}.xlsx`});
                                })
                            }
                            catch (err) {    
                                console.log(err)
                                res.send({    status: "error",    message: "Something went wrong",  });  }
                        })
                    }else{
                        res.status(404).json({"msg": "not found"})
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({"msg":"Invalid Batch details"})
    }
}

const downloadExcel = (req, res) => {
    const {batch} = req.params;
    let filePath = path.join(__dirname, '..', 'utils', 'temp') 
    try {
        res.download(path.join(filePath, batch));
    } catch (error) {
        res.status(400).json({"msg":"Invalid Batch details"})
    }
}

module.exports = {registerStudent, loginStudent, downloadExcel, getAllPins, markAttendance, getAllAttendances, excelAttendances, studentExcel};