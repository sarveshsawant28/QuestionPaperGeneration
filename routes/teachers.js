const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {getDashboard, getPatterns, getSpecificPattern, generatePaper, addNewSub} = require("../controllers/teachers");
const {isLoggedIn, isTeacher, isValidCustomisePaper} = require("../middleware");

router.get("/", isLoggedIn, catchAsync(getDashboard));

router.post("/", isLoggedIn, catchAsync(addNewSub));

router.get("/:subjectId/patterns", isLoggedIn, isTeacher, catchAsync(getPatterns));

router.get("/:subjectId/patterns/:patternId", isLoggedIn, isTeacher, catchAsync(getSpecificPattern));

router.post("/:subjectId/patterns/:patternId/generate", isLoggedIn, isTeacher, isValidCustomisePaper, catchAsync(generatePaper));

module.exports = router;