const express = require('express');

const {getResult, getAttemptWiseList} = require('../controllers/report');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /report/attempts
router.get(
    '/attempts',
    isAuth,
    getAttemptWiseList
)

// GET /report/:resultId?
router.get(
    '/:resultId?',
    isAuth,
    getResult
);



module.exports = router;