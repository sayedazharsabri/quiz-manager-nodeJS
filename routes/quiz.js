const express = require('express');
const { body } = require('express-validator');

const { createQuiz, getQuiz, publishQuiz, updateQuiz } = require('../controllers/quiz');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


/* This route will use to create the quiz*/
// POST /quiz/
router.post(
    '/',
    isAuth,
    [
        body('name')
            .trim()
            .isLength({ min: 5 })
            .withMessage("Enter a proper name with more than 6 characted"),
        body('question_list')
            .custom((queArr) => {
                if (!Array.isArray(queArr) || queArr.length == 0) {
                    return Promise.reject("There should be atleast 1 question");
                }
                const totalQuestions = queArr.length;
                for (let i = 0; i < totalQuestions; i++) {
                    const element = queArr[i];
                    if (!element['question_number'] || !element['question'] || !element['options'] || Object.keys(element['options']).length == 0) {
                        return Promise.reject("Each question should contain question_number, question, and at least one option");
                    }
                }
                return true;
            }),
        body('answers')
            .custom((ansObj, { req }) => {
                const questionList = req.body.question_list;
                const question_list_length = questionList.length;
                let ansMissed = "";
                for (let i = 0; i < question_list_length; i++) {
                    if (!ansObj[questionList[i]['question_number']]) {
                        ansMissed += questionList[i]['question_number'] + ", ";
                    }
                }
                if (ansMissed != "") {
                    ansMissed = ansMissed.substring(0, ansMissed.length - 2);
                    return Promise.reject("Kindly add answers for Qustion number " + ansMissed);
                }
                return true;
            }),
        body('per_question_marks')
            .custom(num => {
                if (num < 1) {
                    return Promise.reject("Per question marks should be 1 or greater");
                }
                return true;
            }),
        body('is_negative_marks_allowed')
            .custom((value, { req }) => {
                if (value) {
                    if (req.body.per_question_marks < req.body.per_question_negative_marks) {

                        return Promise.reject("Per question marks should be greater or equal to negative marks");
                    }
                    if (req.body.per_question_negative_marks <= 0) {

                        return Promise.reject("Per question negative marks should be greater than 0");
                    }
                }
                return true;
            }),
        body('pass_percent')
            .custom(value => {
                if (value >= 0 && value <= 100) {
                    return true;
                }
                return Promise.reject("Enter a valid pass percent, number between 0 to 100");
            })
    ],
    createQuiz
);

/*This route is used to get quiz*/
// POST /quiz/quizId
router.get('/:quizId?', isAuth, getQuiz);

/*This route is used to update the quiz*/
// PUT /quiz/
router.put(
    '/',
    isAuth,
    [
        body('_id')
            .trim()
            .isLength({ min: 5 })
            .withMessage("Please enter valid quizID"),
        body('name')
            .trim()
            .isLength({ min: 5 })
            .withMessage("Enter a proper name with more than 6 characted"),
        body('question_list')
            .custom((queArr) => {
                if (!Array.isArray(queArr) || queArr.length == 0) {
                    return Promise.reject("There should be atleast 1 question");
                }
                const totalQuestions = queArr.length;
                for (let i = 0; i < totalQuestions; i++) {
                    const element = queArr[i];
                    if (!element['question_number'] || !element['question'] || !element['options'] || Object.keys(element['options']).length == 0) {
                        return Promise.reject("Each question should contain question_number, question, and at least one option");
                    }
                }
                return true;
            }),
        body('answers')
            .custom((ansObj, { req }) => {
                const questionList = req.body.question_list;
                const question_list_length = questionList.length;
                let ansMissed = "";
                for (let i = 0; i < question_list_length; i++) {
                    if (!ansObj[questionList[i]['question_number']]) {
                        ansMissed += questionList[i]['question_number'] + ", ";
                    }
                }
                if (ansMissed != "") {
                    ansMissed = ansMissed.substring(0, ansMissed.length - 2);
                    return Promise.reject("Kindly add answers for Qustion number " + ansMissed);
                }
                return true;
            }),
        body('per_question_marks')
            .custom(num => {
                if (num < 1) {
                    return Promise.reject("Per question marks should be 1 or greater");
                }
                return true;
            }),
        body('is_negative_marks_allowed')
            .custom((value, { req }) => {
                if (value) {
                    if (req.body.per_question_marks < req.body.per_question_negative_marks) {

                        return Promise.reject("Per question marks should be greater or equal to negative marks");
                    }
                    if (req.body.per_question_negative_marks <= 0) {

                        return Promise.reject("Per question negative marks should be greater than 0");
                    }
                }
                return true;
            }),
        body('pass_percent')
            .custom(value => {
                if (value >= 0 && value <= 100) {
                    return true;
                }
                return Promise.reject("Enter a valid pass percent, number between 0 to 100");
            })
    ],
    updateQuiz
);

/*This route is used to publish the quiz*/
// PATCH /quiz/publish
router.patch('/publish', isAuth,
    [
        body('quizId')
            .trim()
            .isLength({ min: 5 })
            .withMessage("Please enter valid quizID"),
    ],
    publishQuiz);
module.exports = router;