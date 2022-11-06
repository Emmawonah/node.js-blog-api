const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const authRoute = require("./routes/authRoute");
// const ownerRouter = require("./routes/ownerPosts");
const articleRouter = require("./routes/articleRoutes")
const blogRouter = require("./routes/publicRoute")
const connectToDatabse = require("./database/db");
require("dotenv").config();

const PORT = process.env.PORT || 4000

const app = express();
require("./authentication/auth");

connectToDatabse()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", authRoute);
app.use(
  "/loggeduser",
  passport.authenticate("jwt", { session: false }),
  articleRouter
);
app.use("/public",blogRouter)

app.use(async (req, res, next) => {
  const error = new Error("page not found");
  error.status = 404;
  next(error);
});
app.use(async (error,req,res,next) => {
  const statusCode = error.status || 500
  const message = error.message || "Server errror"

  return res.status(statusCode).send(message)
});

app.listen(PORT, () => {
    console.log(`Listening on port, ${PORT} succesfully`)
})

module.exports = app