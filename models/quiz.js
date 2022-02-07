const mongoose = require('mongoose');

const schema = mongoose.Schema;

const quizSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    question_list: [
        {
            question_number: Number,
            question: String,
            options: {}
        }
    ],
    answers: {},
    is_published: {
        type: Boolean,
        default: false,
    },
    created_by:
    {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    is_negative_marks_allowed: {
        type: Boolean,
        default: false
    },
    per_question_marks:{
        type: Number,
        default: 1
    },
    per_question_negative_marks:{
        type: Number,
        default: 0
    },
    pass_percent:{
        type: Number,
        default: 60
    },
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;