const Subject = require("../models/subject");
const Pattern = require("../models/pattern");
const Module = require("../models/module");
const Set = require("../models/set");
const Question = require("../models/question");
const User = require("../models/user");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");

module.exports = {
    async getDashboard(req, res, next) {
        const user = await User.findById(req.user._id);
        const userSubjects = await Subject.find({_id: {
            $in: user.subjects
        }});
        const subjects = await Subject.find({_id: {
            $nin: user.subjects
        }});
        res.render("dashboard", {subjects, userSubjects})
    },
    async addNewSub(req, res, next) {
        const user = req.user;
        const subject = await Subject.findOne({title: req.body.subject});
        const adminUsers = await User.find({isAdmin: true});
        for(let u of adminUsers) {
            u.notifications.push({
                user: req.user._id,
                subject: subject._id
            });
            await u.save();
        }
        user.subjects.push(subject._id);
        await user.save();
        res.redirect("/subjects");
    },
    async getPatterns(req, res, next) {
        const {subjectId} = req.params;
        const subject = await Subject.findById(subjectId);
        const semPatterns = await Pattern.find({maxMarks: 80});
        const unitPatterns = await Pattern.find({maxMarks: 20});
        res.render("patterns", {semPatterns, unitPatterns, subject});
    },
    async getSpecificPattern(req, res, next) {
        const {subjectId, patternId} = req.params;
        const pattern = await Pattern.findById(patternId).populate('sets');
        const maxNumOfQues = pattern.sets.reduce((acc, next) => {
            return acc + next.totalQuestions;
        }, 0);
        console.log(maxNumOfQues);
        const subject = await Subject.findById(subjectId).populate('modules');
        res.render("specificPattern", {subject, patternId, pattern, maxNumOfQues});
    },
    async generatePaper(req, res, next) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const {subjectId, patternId} = req.params;
        const {customise} = req.body;
        let day;
        let month;
        let year;
        if(req.body.semExamDate) {
            [year, month] = req.body.semExamDate.split("-");
            let tempMonth = month;
            month = monthNames[parseInt(tempMonth) - 1]
        }
        if(req.body.examDate) {
            [year, month, day] = req.body.examDate.split("-");
        }
        const subject = await Subject.findById(subjectId);
        if(customise === "no") {
            const {portion} = req.body;
            console.log(req.body);
            const pattern = await Pattern.findById(patternId).populate('sets').exec();
            const modules = await Module.find({_id: {
                $in: portion
            }}).populate({
                path: 'questions',
                populate: {
                    path: 'module',
                    model: 'Module'
                }
            }).exec();
            const refArr = [];
            const questions = [];
            for(let i = 0; i < modules.length; i++) {
                refArr.push(i);
            }
            for(let m = 0; m < pattern.sets.length; m++) {
                questions.push({
                    title: undefined,
                    ques: [],
                    marks: undefined
                })
            }
            const {sets} = pattern;
            for(let j = 0; j < sets.length; j++) {
                const set = sets[j];
                let sliceArr = refArr.slice();
                let markDeduct = Math.floor(set.marks / set.questionsToAttempt);
                if(set.questionsToAttempt === set.totalQuestions) {
                    questions[j].title = "Attempt the following";
                } else {
                    questions[j].title = `Attempt any ${set.questionsToAttempt} from ${set.totalQuestions}`;
                }
                questions[j].marks = set.marks;
                for(let k = 0; k < set.totalQuestions; k++) {
                    const randNum = Math.floor(Math.random() * sliceArr.length);
                    const curModule = modules[sliceArr[randNum]];
                    if(curModule.marks >= markDeduct) {
                        let randIdx = Math.floor(Math.random() * curModule.questions.length);
                        let newQuestion = curModule.questions[randIdx];
                        curModule.questions.splice(randIdx, 1);
                        curModule.marks-=markDeduct;
                        sliceArr.splice(randNum, 1);
                        // questions.push({title: newQuestion.title, module: newQuestion.module.title});
                        questions[j].ques.push({title: newQuestion.title, module: newQuestion.module.title});
                    } else {
                        k--;
                        sliceArr.splice(randNum, 1);
                    }
                    if(!sliceArr.length) {
                        sliceArr = refArr.slice();
                    }
                }
                sliceArr = refArr.slice();
            }
            // res.render("paper", {questions, pattern});
            ejs.renderFile(path.join(__dirname, '../views/', "paper.ejs"), {
                questions: questions,
                pattern,
                subject,
                month,
                day,
                year,
                type: req.body.examType
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    let assestPath = path.join(__dirname + "/../public/");
                    // let assestPath = `${__dirname}/../public/`;
                    assestPath = assestPath.replace(new RegExp(/\\/g), "/");
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "base": "file:///" + assestPath
                    };
                    pdf.create(data, options).toFile("questionPaper.pdf", function (err, data) {
                        if (err) {
                            console.log("Here");
                            res.send(err);
                        } else {
                            let pathToAttachment = `${__dirname}/../questionPaper.pdf`;
                            let attachment = fs.readFileSync(pathToAttachment).toString("base64");
                            const msg = {
                            to: req.user.email,
                            from: 'akshaysarmalkar74@gmail.com',
                            subject: `${subject.title} Question Paper`,
                            text: 'Please Check Attachment',
                            attachments: [
                                {
                                content: attachment,
                                filename: "attachment.pdf",
                                type: "application/pdf",
                                disposition: "attachment"
                                }
                            ]
                            };
                            sgMail.send(msg).catch(err => {
                            console.log(err);
                            });
                            req.session.success = `Paper has been sent to ${req.user.email}.`
                            res.redirect("/subjects");
                        }
                    });
                }
            });
        } else {
            const {portion} = req.body;
            const pattern = await Pattern.findById(patternId).populate('sets').exec();
            const modules = await Module.find({_id: {
                $in: portion
            }}).populate({
                path: 'questions',
                populate: {
                    path: 'module',
                    model: 'Module'
                }
            }).exec();

            const {marks} = req.body;
            for(let key in marks) {
                if(marks[key]) {
                    for(let module of modules) {
                        if(module.title === key) {
                            module.numOfQuestions = marks[key];
                            break;
                        }
                    }
                }
            }

            const refArr = [];
            const questions = [];
            for(let i = 0; i < modules.length; i++) {
                refArr.push(i);
            }
            for(let m = 0; m < pattern.sets.length; m++) {
                questions.push({
                    title: undefined,
                    ques: [],	
                    marks: undefined
                })
            }
            const {sets} = pattern;
            for(let j = 0; j < sets.length; j++) {
                const set = sets[j];
                console.log(set);
                if(set.questionsToAttempt === set.totalQuestions) {
                    questions[j].title = "Attempt the following";
                } else {
                    questions[j].title = `Attempt any ${set.questionsToAttempt} from ${set.totalQuestions}`;
                }
                questions[j].marks = set.marks;
                let sliceArr = refArr.slice();
                for(let k = 0; k < set.totalQuestions; k++) {
                    const randNum = Math.floor(Math.random() * sliceArr.length);
                    const curModule = modules[sliceArr[randNum]];
                    if(curModule.numOfQuestions > 0) {
                        let randIdx = Math.floor(Math.random() * curModule.questions.length);
                        let newQuestion = curModule.questions[randIdx];
                        curModule.questions.splice(randIdx, 1);
                        sliceArr.splice(randNum, 1);
                        // questions.push({title: newQuestion.title, module: newQuestion.module.title});
                        questions[j].ques.push({title: newQuestion.title, module: newQuestion.module.title});
                        curModule.numOfQuestions--;
                    } else {
                        k--;
                        sliceArr.splice(randNum, 1);
                    }
                    if(!sliceArr.length) {
                        sliceArr = refArr.slice();
                    }
                }
                sliceArr = refArr.slice();
            }
            ejs.renderFile(path.join(__dirname, '../views/', "paper.ejs"), {
                questions: questions,	
                pattern,
                subject,	
                month,	
                day,	
                year,	
                type: req.body.examType
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    let assestPath = path.join(__dirname + "/../public/");	
                    // let assestPath = `${__dirname}/../public/`;	
                    assestPath = assestPath.replace(new RegExp(/\\/g), "/");
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "base": "file:///" + assestPath
                    };
                    pdf.create(data, options).toFile("questionPaper.pdf", function (err, data) {
                        if (err) {
                            console.log("Here");
                            res.send(err);
                        } else {
                            console.log(__dirname);
                            let pathToAttachment = `${__dirname}/../questionPaper.pdf`;
                            let attachment = fs.readFileSync(pathToAttachment).toString("base64");
                            const msg = {
                            to: req.user.email,
                            from: 'akshaysarmalkar74@gmail.com',
                            subject: `${subject.title} Question Paper`,
                            text: 'Please Check Attachment',
                            attachments: [
                                {
                                content: attachment,
                                filename: "attachment.pdf",
                                type: "application/pdf",
                                disposition: "attachment"
                                }
                            ]
                            };
                            sgMail.send(msg).catch(err => {
                            console.log(err);
                            });
                            req.session.success = `Paper has been sent to ${req.user.email}.`
                            res.redirect("/subjects");
                        }
                    });
                }
            });
        }
    }
}