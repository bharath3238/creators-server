const { registerStudent, loginStudent, getAllPins, markAttendance, getAllAttendances, excelAttendances, studentExcel, downloadExcel } = require("../controllers/students");
const { tokenMiddleware } = require("../middleware.js/tokenMiddleware");
const srouter = require("express").Router();

srouter.post('/register', registerStudent);
srouter.post('/login', loginStudent);
srouter.get('/:batch', tokenMiddleware, getAllPins); // => rollnums
srouter.post('/attendance/:batch', tokenMiddleware, markAttendance);
srouter.get('/getattendance/:batch', tokenMiddleware, getAllAttendances);
srouter.get('/excelattendance/:date', tokenMiddleware, excelAttendances);
srouter.get('/studentExcel/:batch', tokenMiddleware, studentExcel);
srouter.get('/utils/temp/:batch', downloadExcel)

module.exports = {srouter}