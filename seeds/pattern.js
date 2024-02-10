const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/qp-app';
const mongoose = require("mongoose");


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const Pattern = require("../models/pattern");
const Set = require("../models/set");

async function one() {
    const sets = [];
    const newPattern = new Pattern({title: "Semester 1", maxMarks: 80})
    for(let i = 0; i < 6; i++) {
        let newSet;
        if(i === 0) {
            newSet = new Set({marks: 20, questionsToAttempt: 4, totalQuestions: 4});
        } else {
            newSet = new Set({marks: 20, questionsToAttempt: 2, totalQuestions: 2});
        }
        await newSet.save();
        sets.push(newSet);
    }
    newPattern.sets = sets;
    await newPattern.save();
}

async function two() {
    const sets = [];
    const newPattern = new Pattern({title: "Semester 2", maxMarks: 80})
    for(let i = 0; i < 6; i++) {
        let newSet;
        if(i === 0) {
            newSet = new Set({marks: 20, questionsToAttempt: 4, totalQuestions: 4});
        } else if (i === 5) {
            newSet = new Set({marks: 20, questionsToAttempt: 4, totalQuestions: 4});
        } else {
            newSet = new Set({marks: 20, questionsToAttempt: 2, totalQuestions: 2});
        }
        await newSet.save();
        sets.push(newSet);
    }
    newPattern.sets = sets;
    await newPattern.save();
}

async function three() {
    const sets = [];
    const newPattern = new Pattern({title: "Unit Test 1", maxMarks: 20})
    for(let i = 0; i < 3; i++) {
        let newSet;
        if(i === 0) {
            newSet = new Set({marks: 10, questionsToAttempt: 5, totalQuestions: 6});
        } else {
            newSet = new Set({marks: 5, questionsToAttempt: 1, totalQuestions: 2});
        }
        await newSet.save();
        sets.push(newSet);
    }
    newPattern.sets = sets;
    await newPattern.save();
}

async function four() {
    const sets = [];
    const newPattern = new Pattern({title: "Unit Test 2", maxMarks: 20})
    for(let i = 0; i < 3; i++) {
        let newSet;
        if(i === 0) {
            newSet = new Set({marks: 10, questionsToAttempt: 5, totalQuestions: 7});
        } else {
            newSet = new Set({marks: 5, questionsToAttempt: 1, totalQuestions: 3});
        }
        await newSet.save();
        sets.push(newSet);
    }
    newPattern.sets = sets;
    await newPattern.save();
}

const seedDB = async function() {
    await one();
    await two();
    await three();
    await four();
    console.log("Done");
}


seedDB().then(() => {
    mongoose.connection.close();
})