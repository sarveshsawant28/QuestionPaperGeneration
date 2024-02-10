const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const patternModel = new Schema({
    title: String,
    sets: [{
        type: Schema.Types.ObjectId,
        ref: 'Set'
    }],
    maxMarks: Number
});

module.exports = mongoose.model("Pattern", patternModel);