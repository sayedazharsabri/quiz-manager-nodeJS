const express = require('express');

const {getResult, getAttemptWiseList} = require('../controllers/report');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/*This route will return report of number of attempts for all attepted quizzes*/
// GET /report/attempts
router.get(
    '/attempts',
    isAuth,
    getAttemptWiseList
)

/*This route will return report of all attepted quizzes or details for a particular one*/
// GET /report/:resultId?
router.get(
    '/:resultId?',
    isAuth,
    getResult
);



module.exports = router;  