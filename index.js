const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const db = require("./config/keys.js").MongoURI;
const PORT = process.env.PORT || 5000;
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");


mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDb connected..."))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: false, limit: "20mb" }));

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.static("media"));

app.use("/", require("./routes/app.js"));
app.use("/classroom", require("./routes/classroom.js"));

app.listen(PORT, console.log(`Server running at ${PORT}`));
