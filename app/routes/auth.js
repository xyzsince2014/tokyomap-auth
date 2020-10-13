const dotenv = require('dotenv');
const router = require("express").Router();
const authController = require("../controllers/auth");

// todo: use process.env.DOMAIN_CLIENT
// dotenv.config();
const CLIENT = "http://localhost:3000";
const sessionConfig = {
  successRedirect: CLIENT,
  failureRedirect: CLIENT,
  session: true,
};

module.exports = passport => {
  router
    .get("/authenticate", authController.authenticate)
    .get("/signout", authController.signout)
    // .get("/:provider", (req, res, next) => {
    //   passport.authenticate(req.params.provider);
    // })
    // .get("/:provider/callback", (req, res, next) => {
    //   passport.authenticate(req.params.provider, sessionConfig);
    // })
    .get("/twitter", passport.authenticate("twitter"))
    .get("/twitter/callback", passport.authenticate("twitter", sessionConfig))
    .get("/facebook", passport.authenticate("facebook"))
    .get("/facebook/callback", passport.authenticate("facebook", sessionConfig))
    .get("/line", passport.authenticate("line"))
    .get("/line/callback", passport.authenticate("line", sessionConfig));

  return router;
};
