const { getStudentDetailsPrinciple, getStudentDetailsBranch, getProfile, updateProfile, addNewDetails, deleteAccount } = require("../controllers/pstaff");
const { roleMiddleware } = require("../middleware.js/roleAuthentication");
const { tokenMiddleware, studentTokenMiddleware } = require("../middleware.js/tokenMiddleware");
const prouter = require("express").Router();

prouter.get('/principle/:batch/:branch', roleMiddleware.principleRole, getStudentDetailsPrinciple);
prouter.get('/staff/:batch', [roleMiddleware.hodRole], getStudentDetailsBranch);
prouter.get('/stdprofile', studentTokenMiddleware, getProfile );
prouter.patch('/stdprofileupdate/:id', studentTokenMiddleware, updateProfile );
prouter.patch('/stdprofileupdate', studentTokenMiddleware, addNewDetails );
prouter.delete('/stdprofiledelete/:id', studentTokenMiddleware, deleteAccount );

module.exports = {prouter}