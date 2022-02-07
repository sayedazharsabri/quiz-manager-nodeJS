const mongoose = require('mongoose');

const schema = mongoose.Schema;

const resultSchema = new schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    total_questions: {
        type: Number,
        required: true,
    },
    correct_answers: {
        type: Number,
        required: true,
    },
    incorrect_answers: {
        type: Number,
        required: true,
    },
    notattempted_answers: {
        type: Number,
        required: true,
        default: 0
    },
    result_percent: {
        type: Number,
        required: true,
    },
    submitted_answers: {}
}, { timestamps: true });

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;