const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Module = require('./module');

const subjectModel = new Schema({
    title: String,
    modules: [{
        type: Schema.Types.ObjectId,
        ref: 'Module'
    }],
    teachers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxMarks: Number,
    totalMarks: Number,
    branch: String,
    semester: Number
});

subjectModel.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Module.deleteMany({
            _id: {
                $in: doc.modules
            }
        })
    }
})


module.exports = mongoose.model("Subject", subjectModel);