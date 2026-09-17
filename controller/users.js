const User = require("../models/user");

module.exports.signupRouter = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signupPostRouter = async(req, res, next) => {
    try{
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust!");
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }

};

module.exports.loginRouter = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.loginPostRouter = async(req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutRouter = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You logged out!");
        res.redirect("/listings");
    })
};
