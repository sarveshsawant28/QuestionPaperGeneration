const Subject = require("./models/subject");
const Pattern = require("./models/pattern");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.session.error =  'You must be signed in first!';
        return res.redirect('/login');
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        req.session.returnTo = req.originalUrl
        req.session.error =  'You must be an Admin!';
        return res.redirect('back');
    }
    next();
}

module.exports.isTeacher = async (req, res, next) => {
    const {subjectId} = req.params;
    const subject = await Subject.findById(subjectId);
    if(!subject.teachers.includes(req.user._id)) {
        req.session.error =  'You dont have permission to generate this paper!';
        return res.redirect('back');
    } 
    next();
}

module.exports.isValidCustomisePaper = async (req, res, next) => {
    const {customise, marks} = req.body;
    if(customise === "yes") {
        const {patternId} = req.params;
        const pattern = await Pattern.findById(patternId).populate('sets')
        const maxNumOfQues = pattern.sets.reduce((acc, next) => {
            return acc + next.totalQuestions;
        }, 0);
        let sum = 0;
        for(let key in marks) {
            sum += parseInt(marks[key]);
        }
        if(sum === maxNumOfQues) {
            next();
        } else {
            req.session.error = 'You have either inserted more or less questions than required!';
            res.redirect('/subjects');
        }
    } else {
        next();
    }
    
}