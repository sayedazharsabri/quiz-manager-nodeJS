const express = require('express');
const { body } = require('express-validator');

const { createQuiz, editQuiz, publishQuiz, updateQuiz } = require('../controllers/quiz');
const isAuth = require('../middleware/is-auth');

const router = express.Router();



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
                const ansMissed = [];
                for (let i = 0; i < question_list_length; i++) {
                    if (!ansObj[questionList[i]['question_number']]) {
                        ansMissed.push(questionList[i]['question_number']);
                    }
                }
                if (ansMissed.length > 0) {
                    return Promise.reject({ "message": "Kindly add all the answers", data: { question_numbers: ansMissed } });
                }
                return true;
            })
    ],
    createQuiz
);

// POST /quiz/edit  
router.post('/edit', isAuth, [
    body('quizId')
        .trim()
        .isLength({ min: 5 })
        .withMessage("Please enter valid quizID"),
], editQuiz);

// POST /quiz/update
router.post(
    '/update',
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
                const ansMissed = [];
                for (let i = 0; i < question_list_length; i++) {
                    if (!ansObj[questionList[i]['question_number']]) {
                        ansMissed.push(questionList[i]['question_number']);
                    }
                }
                if (ansMissed.length > 0) {
                    return Promise.reject({ "message": "Kindly add all the answers", data: { question_numbers: ansMissed } });
                }
                return true;
            })
    ],
    updateQuiz
);

// POST /quiz/publish
router.post('/publish', isAuth,
    [
        body('quizId')
            .trim()
            .isLength({ min: 5 })
            .withMessage("Please enter valid quizID"),
    ],
    publishQuiz);
module.exports = router;