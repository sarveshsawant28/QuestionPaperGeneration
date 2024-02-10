const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = require('./question');

const moduleModel = new Schema({
    title: String,
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    marks: Number,
    numOfQuestions: Number
});

moduleModel.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Question.deleteMany({
            _id: {
                $in: doc.questions
            }
        })
    }
})

moduleModel.post('deleteMany', async function (doc) {
    if (doc) {
        await Question.deleteMany({
            _id: {
                $in: doc.questions
            }
        })
    }
})

module.exports = mongoose.model("Module", moduleModel);