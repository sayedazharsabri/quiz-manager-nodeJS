const express = require('express');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const quizRoute = require('./routes/quiz');
const examRoute = require('./routes/exam');
const reportRoute = require('./routes/report');
const logger = require('./logger/logger');

const app = express();

app.use(express.json());

app.use("/auth", authRoute);
app.use("/quiz", quizRoute);
app.use("/exam", examRoute);
app.use("/report", reportRoute);

app.use((error, req, res, next) => {
    //Express Error handling route

    const status = error.statusCode || 500;
    let message = error.message;
    const data = error.data;
    logger.error(JSON.stringify({status:status, message: message, data: data})); 
    if(status == 500){
        message = "Something went wrong, please try after sometime";
    } 

    res.status(status).json({status:"error", message: message, data: data });
});


mongoose.connect(process.env.MONGODB_CONNECTION_STRING, (err) => {
    if (err) {
        logger.error(err);
        return;
    }
    app.listen(process.env.PORT || 3000, () => {
        logger.info("Server Started");
    })
}) 