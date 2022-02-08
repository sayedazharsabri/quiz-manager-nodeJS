const mongoose = require('mongoose');
const moment = require('moment');

const { validationResult } = require('express-validator');

const Quiz = require('../models/quiz');

exports.createQuiz = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const name = req.body.name;
    const question_list = req.body.question_list;
    const answers = req.body.answers;
    const is_negative_marks_allowed = req.body.is_negative_marks_allowed;
    const per_question_marks = req.body.per_question_marks;
    const per_question_negative_marks = req.body.per_question_negative_marks;

    const quiz = new Quiz({ name, question_list, answers, created_by: req.userId, is_negative_marks_allowed, per_question_marks, per_question_negative_marks });
    const result = await quiz.save();
    res.status(201).send({ status: "success", message: "Quiz created successful", data: { quizId: result._id } });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.getQuiz = async (req, res, next) => {
  try {
    //Return the particular, if created by this user

    let quiz;
    if (!!req.params.quizId) {
      const quizId = req.params.quizId;
      quiz = await Quiz.findById(quizId);

      if (quiz.created_by.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }


    } else {
      //List all quiz created by this user
      let userFilter = { created_by: mongoose.Types.ObjectId(req.userId) }
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

      quiz = await Quiz.aggregate([
        { $match: matchObj },
        {
          $project: { _id: 1, name: 1, createdAt: 1, is_published: 1, created_by: 1 }
        }
      ]);

    }//?




    if (!quiz) {
      const error = new Error('Could not find quiz.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: 'Quiz fetched.', quiz: quiz });

  }


  catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


exports.updateQuiz = async (req, res, next) => {

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const quizId = req.body._id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const error = new Error('Could not find quiz.');
      error.statusCode = 404;
      throw error;
    }

    if (quiz.created_by.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    if (quiz.is_published) {
      const error = new Error('Published Quiz cannot be Updated!');
      error.statusCode = 405;//???Method not allowed
      throw error;
    }

    quiz.question_list = req.body.question_list;
    quiz.answers = req.body.answers;
    quiz.is_negative_marks_allowed = req.body.is_negative_marks_allowed;
    quiz.per_question_marks = req.body.per_question_marks;
    quiz.per_question_negative_marks = req.body.per_question_negative_marks;
    quiz.pass_percent = req.body.pass_percent;

    await quiz.save();
    res.status(200).json({ message: 'Quiz Updated.', quiz: quiz });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }


};


exports.publishQuiz = async (req, res, next) => {

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const quizId = req.body.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      const error = new Error('Could not find quiz.');
      error.statusCode = 404;
      throw error;
    }

    if (quiz.created_by.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    quiz.is_published = true;
    await quiz.save();
    res.status(200).json({ message: 'Quiz Published.', quiz: quiz });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.isQuestionNameExist = async (name) => {
  const quiz = await Quiz.findOne({ name });
  if (quiz) {
      return true;
  }
  return false;
}