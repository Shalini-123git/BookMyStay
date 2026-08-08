const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/users.js");
const booking = require("./routes/booking.js");
const paymentRouter = require("./routes/payment.js");

main()
   .then(() => {
        console.log("connected to db");
        app.listen(port, () => {
            console.log("server is listening to port 8080");
        });
   })
   .catch( (err) => {
      console.log(err.message);
   });

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
        maAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
}; 

app.get("/", (req, res) => {
    res.redirect("/listings")
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.message = req.flash("success");
    res.locals.failure = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async (req, res) => {
//      let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/bookListing", booking);
app.use("/payments", paymentRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//if route not match than execute
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

//custom error handling
app.use((err, req, res, next) => {
    let {statusCode= 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
    
});
