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
    }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;