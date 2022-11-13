const mongoose = require("mongoose");

const staffSchema = mongoose.Schema({
    username:{type: String, required:true},
    email:{type: String, required:true},
    password:{type: Object, required:true},
    role:{type: String, required:true},
    phone:{type: Object, required:true},
    branch:{type: String, required:true},
    institute:{type: String, required:true},
})

const staffModel = mongoose.model("staffModel", staffSchema);
module.exports = staffModel