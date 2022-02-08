const Result = require('../models/result');
const mongoose = require('mongoose');
const moment = require('moment');

exports.getResult = async (req, res, next) => {
    try {

        let result;
        let from_date;
        let to_date;


        if (!!req.params.resultId) {
            result = await Result.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(req.params.resultId), user_id: mongoose.Types.ObjectId(req.userId) } },
                {
                    $lookup: {
                        from: "quizzes",
                        localField: "quiz_id",
                        foreignField: "_id", as: "quiz"
                    }
                },
                {
                    $project: {
                        quiz_id: 1,
                        total_questions: 1,
                        correct_answers: 1,
                        incorrect_answers: 1,
                        notattempted_answers: 1,
                        result_percent: 1,
                        createdAt: 1,
                        total_marks: 1,
                        marks_obtained: 1,
                        result_status: 1,
                        quiz: { name: 1 }
                    }

                }
            ]);

        } else {
            //Checking for date filters
            let userFilter = { user_id: mongoose.Types.ObjectId(req.userId) }
            let matchObj = { ...userFilter };
            let from_date;
            let to_date;
      
            if (!!req.query.from_date) {
              from_date = req.query.from_date;
              if (!(moment(req.query.from_date, "YYYY-MM-DD", true).isValid())) {
                const error = new Error('Invalida from_date date, format should be yyyy-mm-dd.');
                error.statusCode = 422;
                throw error;
              }
              matchObj = { ...userFilter, createdAt: { $gte: new Date(from_date) } };
            }
      
            if (!!req.query.to_date) {
              to_date = req.query.to_date;
              if (!moment(req.query.to_date, "YYYY-MM-DD", true).isValid()) {
                const error = new Error('Invalida to_date date, format should be yyyy-mm-dd.');
                error.statusCode = 422;
                throw error;
              }
              matchObj = { ...userFilter, createdAt: { $lte: new Date(to_date) } };
            }
      
            if (!!from_date && !!to_date) {
              console.log("Here");
              matchObj = { ...userFilter,  $and: [{ createdAt: { $lte: new Date(to_date) } }, { createdAt: { $gte: new Date(from_date) } }] }
            }
      

            result = await Result.aggregate([
                { $match: matchObj },
                {
                    $lookup: {
                        from: "quizzes",
                        localField: "quiz_id",
                        foreignField: "_id", as: "quiz"
                    }
                },
                {
                    $project: { _id: 1, quiz_id: 1, result_status: 1, quiz: { name: 1 }, createdAt: 1 }

                }
            ]);
        }

        if (!result) {
            const error = new Error('Could not find result.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message: 'Your report.', data: { result: result } });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getAttemptWiseList = async (req, res, next) => {
    try {

        let result;
        result = await Result.aggregate([
            { $match: { user_id: mongoose.Types.ObjectId(req.userId) } },
            { $group: { _id: "$quiz_id", numberOfAttempts: { $sum: 1 }, quiz_id: { $first: "$quiz_id" } } },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "quiz_id",
                    foreignField: "_id", as: "quiz"
                }
            },
            {
                $project: { _id: 0, quiz_id: 1, numberOfAttempts: 1, quiz: { name: 1 } }

            }
        ]);

        if (!result) {
            const error = new Error('Could not find result.');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ message: 'Your attempt report.', data: { result: result } });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

