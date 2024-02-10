const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionModel = new Schema({
    title: String,
    module: {
        type: Schema.Types.ObjectId,
        ref: 'Module'
    },
});

module.exports = mongoose.model("Question", questionModel);