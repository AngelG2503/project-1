require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const dbUrl = process.env.ATLASDB_URL;
const secret = process.env.SECRET;

console.log("DB URL:", process.env.ATLASDB_URL);
console.log("SECRET:", process.env.SECRET);

async function main(){
    await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log(err);
});
const store =MongoStore.create({
    mongoUrl:dbUrl, 
    crypto:{
        secret: secret
    },
    touchAfter:24*60*60
});

store.on("error",(err)=>{
    console.log("session store error",err);
})
const sessionOptions = {
    store,
    secret: secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly :true,

    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;

    next();
})


app.use("/listings",listingRoutes);
app.use("/listings/:id/reviews",reviewRoutes);
app.use("/",userRoutes);

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});
app.use((err, req, res, next) => {
    // 💡 Crucial check: If headers have already been sent, pass the error
    // to the default Express handler instead of attempting to render.
    if (res.headersSent) {
        return next(err); 
    }
    
    let { statusCode = 500, message = "Something went wrong" } = err;
    
    // Set status and render
    res.status(statusCode).render("listings/error", { err });
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});