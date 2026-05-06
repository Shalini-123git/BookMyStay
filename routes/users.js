const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

router.route("/signup")
    .get(userController.signupRouter)
    .post(wrapAsync(userController.signupPostRouter));

router.route("/login")
    .get(userController.loginRouter)
    .post(saveRedirectUrl, 
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true,}), 
        userController.loginPostRouter
    );

router.get("/logout", userController.logoutRouter);

module.exports = router;