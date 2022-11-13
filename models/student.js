const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
    username:{type: String, required:true},
    email:{type: String, required:true},
    password:{type: Object, required:true},
    phone:{type: Object, required:true},
    pin:{type: String, required:true},
    batch:{type: String, required:true},
    branch:{type: String, required:true},
    institute:{type: String, required:true},
    details:{type: Object}
})

const attendanceSchema = mongoose.Schema({
    batch:{type: String, required:true},
    instituteCode:{type: String, required:true},
    list:{type: Array, required: true},
    branch:{type:String, required:true},
    date:{type: Date, default: Date.now()}
})

const studentModel = mongoose.model("studentModel", studentSchema);
const attendanceModel = mongoose.model("attendanceModel", attendanceSchema);
module.exports = {studentModel, attendanceModel}