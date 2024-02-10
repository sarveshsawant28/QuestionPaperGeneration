const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ImageSchema = new Schema({
    url: {
        type: String,
        default: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
    },
    filename: String
});

const notificationSchema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    first: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    avatar: {
        url: {
            type: String,
            default: 'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png'
        },
        filename: String
    },
    resetPasswordToken: String,
	resetPasswordExpires: Date,
    notifications: [notificationSchema],
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }]
});

UserSchema.plugin(passportLocalMongoose, {
    usernameField: "email"
});

module.exports = mongoose.model('User', UserSchema);