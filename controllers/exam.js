const { validationResult } = require('express-validator');

const Quiz = require('../models/quiz');
const Result = require('../models/result');

exports.startQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId, { answers: 0, created_by: 0 });
    if (!quiz) {
      const error = new Error('Could not find quiz.');
      error.statusCode = 404;
      throw error;
    }

    if (!quiz.is_published) {
      const error = new Error('Quiz still not Published!');
      error.statusCode = 405;//???Method not allowed
      throw error;
    }

    res.status(200).json({ message: 'Start Exam.', quiz: quiz });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}


exports.submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      const error = new Error('Could not find quiz.');
      error.statusCode = 404;
      throw error;
    }

    if (!quiz.is_published) {
      const error = new Error('Quiz still not Published!');
      error.statusCode = 405;//???Method not allowed
      throw error;
    }

    let submitted_answers = req.body.submitted_answers;
    let answers = quiz.answers;
    const questionsArr = Object.keys(answers);
    let total_questions = questionsArr.length;

    let correct_answers = 0;
    let incorrect_answers = 0;
    let notattempted_answers = 0;

    for (let i = 0; i < total_questions; i++) {
      let qNumber = questionsArr[i];
      if (qNumber in submitted_answers) {
        if (answers[qNumber] == submitted_answers[qNumber]) {
          correct_answers++;
        } else {
          incorrect_answers++;
        }
      } else {
        notattempted_answers++;
      }
    }

    let result_percent = ((correct_answers * 100) / total_questions).toFixed(2);
    const result = new Result({
      user_id: req.userId,
      quiz_id: quizId,
      total_questions,
      correct_answers,
      incorrect_answers,
      notattempted_answers,
      result_percent,
      submitted_answers
    });

    const returnResult = await result.save();
    res.status(200).json({ message: 'Exam Submitted', data:{resultId:returnResult._id, resultPercent:result_percent} });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}