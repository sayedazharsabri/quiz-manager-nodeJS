const Result = require('../models/result');
const mongoose = require('mongoose');

exports.getResult = async (req, res, next) => {
    try {

        let result;
        if (!!req.params.resultId) {
            result = await Result.aggregate([
                {$match:{_id:mongoose.Types.ObjectId(req.params.resultId),user_id:mongoose.Types.ObjectId(req.userId)}},
                {$lookup:{
                    from:"quizzes",
                    localField:"quiz_id",
                    foreignField:"_id", as:"quiz"
                }},
                {$project:{
                    quiz_id:1,
                    total_questions:1,
                    correct_answers:1,
                    incorrect_answers:1,
                    notattempted_answers:1,
                    result_percent:1,
                    createdAt:1,
                    quiz:{name:1}}
                    
                }
            ]);
            
            await Result.findOne({_id:req.params.resultId,user_id:req.userId}, { 
                user_id: 0, 
                submitted_answers:0,
            })
        } else{
            result = await Result.aggregate([
                {$match:{user_id:mongoose.Types.ObjectId(req.userId)}},
                {$lookup:{
                    from:"quizzes",
                    localField:"quiz_id",
                    foreignField:"_id", as:"quiz"
                }},
                {$project:{_id:0,quiz_id:1,result_percent:1,quiz:{name:1}}
                    
                }
            ]);
        }

        if (!result) {
            const error = new Error('Could not find result.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message: 'Your report.', data: {result:result}});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAttemptWiseList = async (req, res, next) =>{
    try {

        let result;
        result = await Result.aggregate([
            {$match:{user_id:mongoose.Types.ObjectId(req.userId)}},
            {$group:{_id:"$quiz_id",numberOfAttempts:{$sum:1}, quiz_id:{$first:"$quiz_id"}}},
            {$lookup:{
                from:"quizzes",
                localField:"quiz_id",
                foreignField:"_id", as:"quiz"
            }},
            {$project:{_id:0,quiz_id:1,numberOfAttempts:1,quiz:{name:1}}
                
            }
        ]);

        if (!result) {
            const error = new Error('Could not find result.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message: 'Your attempt report.', data: {result:result}});
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

