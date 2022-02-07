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

    const quiz = new Quiz({ name, question_list, answers, created_by: req.userId });
    const result = await quiz.save();
    res.status(201).send({ status: "success", message: "Quiz created successful", data: { quizId: result._id } });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.editQuiz = async (req, res, next) => {
  try {
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

    if (quiz.is_published) {
      const error = new Error('Published Quiz cannot be Edited!');
      error.statusCode = 405;//???Method not allowed
      throw error;
    }

    res.status(200).json({ message: 'Quiz fetched.', quiz: quiz });

  } catch (error) {
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

    quiz.name = req.body.name;
    quiz.question_list = req.body.question_list;
    quiz.answers = req.body.answers;

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