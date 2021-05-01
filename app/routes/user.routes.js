const check = require("express-validator").check;
const validationResult = require("express-validator").validationResult;
const auth = require("../middleware/auth.js");
module.exports = app =>{
  const users = require("../controllers/user.controller.js");
  var router = require("express").Router();

  //create a new user
  //router.post("/",users.create);

  //user signup
  router.post("/signup",
  [
    //check("username","Please Enter a valid username").not().isEmpty(),
    check("email","Please Enter a valid email").isEmail(),
    check("password","Please Enter a valid password").isLength({
      min: 6
    })
  ],users.signup);

  //user login
  router.post("/login",
  [
      check("email","Please Enter a valid email").isEmail(),
      check("password","Please Enter a valid password").isLength({
        min: 6
      })
  ],users.login);

  //current user
  router.get("/me", auth,users.loggedIn);

  router.get("/findbyfn", users.searchUserByFirstname);

  router.get("/findbyln", users.searchUserByLastName);

  router.get("/connect", users.sendConnectRequest);

  router.get("/accept", users.acceptConnectRequest);

  router.get("/notify", users.notify);

  app.use('/api/user',router);
}
