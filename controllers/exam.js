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
      const error = new Error('Quiz is not Published!');
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
      const error = new Error('Quiz is not Published!');
      error.statusCode = 405;//???Method not allowed
      throw error;
    }

    let submitted_answers = req.body.submitted_answers;
    let answers = quiz.answers;
    let is_negative_marks_allowed = quiz.is_negative_marks_allowed;
    let per_question_marks = quiz.per_question_marks;
    let per_question_negative_marks = quiz.per_question_negative_marks;
    let pass_percent = quiz.pass_percent;


    const questionsArr = Object.keys(answers);
    let total_questions = questionsArr.length;

    let correct_answers = 0;
    let incorrect_answers = 0;
    let notattempted_answers = 0;

    let marks_obtained = 0;
    let negative_marks = 0;
    let total_marks = 0;


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

    if(is_negative_marks_allowed){
      total_marks = total_questions * per_question_marks;
      negative_marks = incorrect_answers * per_question_negative_marks;
      marks_obtained = ((correct_answers * per_question_marks) - negative_marks);
      result_percent = ((marks_obtained * 100) / total_marks).toFixed(2);
    }

    let result_status = "fail";
    if(pass_percent <= result_percent){
      result_status = "pass";
    }

    const result = new Result({
      user_id: req.userId,
      quiz_id: quizId,
      total_questions,
      correct_answers,
      incorrect_answers,
      notattempted_answers,
      result_percent,
      submitted_answers,
      total_marks,
      negative_marks,
      marks_obtained,
      result_status
    });

    const returnResult = await result.save();
    res.status(200).json({ message: 'Exam Submitted', data:{resultId:returnResult._id, result_percent,marks_obtained,result_status} });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}