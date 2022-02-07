const express = require('express');

const { startQuiz, submitQuiz } = require('../controllers/exam');
const isAuth = require('../middleware/is-auth');

const router = express.Router();



// GET /exam/start/:quizeId
router.get(
    '/start/:quizId',
    isAuth,
    startQuiz
);

// POST /exam/submit/:quizeId
router.post(
    '/submit/:quizId',
    isAuth,
    submitQuiz
);

module.exports = router;