const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { staffRouter } = require("./routes/staff");
const { srouter } = require("./routes/student");
const { prouter } = require("./routes/proutes");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000
const DB_SHELL = process.env.DB

app.use(cors());
app.use(express.json());
app.use('/staff', staffRouter);
app.use('/student', srouter);
app.use('/details', prouter)


mongoose.connect(DB_SHELL, {useNewUrlParser: true}).then(() => {
    app.listen(PORT, () => {
        console.log("server started")   
    })
})
