const { checkUP, register } = require("../controllers/staff");
const { RegisterMiddleware } = require("../middleware.js/registerMiddleware");

const staffRouter = require("express").Router();


staffRouter.post('/check', checkUP);
staffRouter.post('/register', RegisterMiddleware, register);

module.exports = {staffRouter}