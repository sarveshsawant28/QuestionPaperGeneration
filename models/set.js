const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setModel = new Schema({
    marks: Number,
    questionsToAttempt: Number,
    totalQuestions: Number
});

module.exports = mongoose.model("Set", setModel);