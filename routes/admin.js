const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {getSubjects, createSubject, getOneSub, getOneModule, createModule, createQuestion, updateQuestion, deleteQuestion, updateSubject, updateModule, getNotifications, declineUser, acceptUser, deleteSubject, deleteModule} = require("../controllers/admin");
const {isLoggedIn, isAdmin} = require("../middleware");

router.get("/", isLoggedIn, isAdmin, catchAsync(getSubjects));

router.post("/", isLoggedIn, isAdmin, catchAsync(createSubject));

router.get("/notifications", isLoggedIn, isAdmin, catchAsync(getNotifications))

router.post("/accept", isLoggedIn, isAdmin, catchAsync(acceptUser));

router.post("/decline", isLoggedIn, isAdmin, catchAsync(declineUser));

router.get("/subjects/:subId", isLoggedIn, isAdmin, catchAsync(getOneSub));

router.put("/subjects/:subId", isLoggedIn, isAdmin, catchAsync(updateSubject));

router.delete("/subjects/:subId", isLoggedIn, isAdmin, catchAsync(deleteSubject));

router.get("/subjects/:subId/modules/:modId", isLoggedIn, isAdmin, catchAsync(getOneModule));

router.put("/subjects/:subId/modules/:modId", isLoggedIn, isAdmin, catchAsync(updateModule));

router.delete("/subjects/:subId/modules/:modId", isLoggedIn, isAdmin, catchAsync(deleteModule));

router.post("/subjects/:subId/modules", isLoggedIn, isAdmin, catchAsync(createModule));

router.post("/subjects/:subId/modules/:modId/questions", isLoggedIn, isAdmin, catchAsync(createQuestion));

router.put("/subjects/:subId/modules/:modId/questions/:questionId", isLoggedIn, isAdmin, catchAsync(updateQuestion));

router.delete("/subjects/:subId/modules/:modId/questions/:questionId", isLoggedIn, isAdmin, catchAsync(deleteQuestion));

module.exports = router;
