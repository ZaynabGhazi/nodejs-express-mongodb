const db = require("../models");
//hash passwords
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validationResult = require("express-validator").validationResult;
const User = db.users;


//signup
exports.signup = (req,res)=>{
    //check empty body
  if (!req.body.email){
    res.status(400);
    res.set("Connection", "close");
    res.send({message: "Content cannot be empty!"});
    return;
  }
  //check validator result
  const errors = validationResult(req);
  if (!errors.isEmpty()){
     res.status(401);
     res.set("Connection", "close");
    return res.json({
      errors: errors.array()
    });
  }
  //get request data
  const{
    email,
    password,
    username,
    firstname,
    lastname,
    status
  } = req.body;

  try{
  User.findOne({
      email: req.body.email
    }).then(data=>{
      if (data){
        res.status(402);
         res.set("Connection", "close");
        return res.json({mssg: "User Already Exists!"});
      }
      //new user:
      user = new User({
        email,
        password,
        username,
        firstname,
        lastname,
        status
      });
      bcrypt.hash(password,10, (err, hash) => {
       if (err) {
        console.error(err)
        res.status(500);
        res.set("Connection", "close");
        res.send({
          message: err.message || "Error hashing password"
        });
        }
       console.log(hash);
       user.password=hash;
       //save user
          user.save(user).then(data=>{
                                  //send jwt
                                  const payload = {
                                  user:{
                                  id: user.id
                                  }
                                  };
                                  jwt.sign(payload, "secretToken",{
                                  expiresIn:10000
                                  },
                                  (err, token)=>{
                                  if (err) throw err;
                                  res.status(200);
                                  res.set("Connection","close");
                                  res.json({
                                  token});
                                  })

                               }).catch(err=>{
                                  res.status(500);
                                  res.set("Connection","close");

                                  res.send({
                                    message: err.message || "Error creating new user"
                                  });
                                });
            });

});

  }
    catch(err){
      console.log(err.message);
      res.status(500);
      res.set("Connection","close");
      res.send("Signup error");
    }

};

//user login
exports.login = (req, res)=>{
      if (!req.body.email){
        res.status(400);
        res.set("Connection","close");
         res.send({message: "Content cannot be empty!"});
        return;
      }
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          res.status(401);
          res.set("Connection","close");
          res.json({
            errors: errors.array()
          });
          return;
        }
        const { email, password} = req.body;
        try{
            User.findOne({
            email: req.body.email}).then(data =>{
                if (!data){
                res.status(402);
                res.set("Connection","close");
                res.json({
                message: "User does not exist!"});
                }
                bcrypt.compare(password,data.password,(err,isMatch)=>{
                    if (err || !isMatch){

                        res.status(403);
                        res.set("Connection","close");
                        res.json({
                        message: "Incorrect password!"
                        });
                    }
                       //send jwt
                       const payload = {
                        user:{
                        id: data.id
                         }
                         };
                         jwt.sign(payload, "secretToken",{
                          expiresIn:10000
                          },
                          (err, token)=>{
                           if (err) throw err;
                           res.status(200);
                           res.set("Connection","close");
                           res.json({
                           token});
                           })
                          })
                         })
  } catch(e){
    console.error(e);
    res.status(500);
    res.set("Connection","close");
    res.json({
    message: "Login error!"});
  }
}


//Retrieve current user
exports.loggedIn = (req,res)=>{
    try{
        User.findOne({
        _id: req.user.id}).then(data=>{
        console.log(req.user.id);
        if (!data){
        res.status(502);
        res.set("Connection","close");
        res.json({
        message: "Error fetching current user!"});
        }
        else{
        res.set("Connection","close");

        res.json(data);
        }
        });
    } catch(e){
    res.set("Connection","close");

    res.send({
    message: "Error fetching user!"});
  }
}



//Create and store a new user
exports.create = (req,res)=>{
  if (!req.body.email){
    res.status(400).send({message: "Content cannot be empty!"});
    return;
  }
  //create user
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    status: req.body.status,
  });
  //save user
  user.save(user).then(data=>{
    res.send(data);
  }).catch(err=>{
    res.status(500).send({
      message: err.message || "Error creating new user!"
    });
  });
};


//Retrieve all users from cloud
exports.findAll = (req,res)=>{};
//find a single user with an id
exports.findOne = (req,res)=>{};
//update a user by the id in the request
exports.update = (req,res)=>{};
//delete a user with specified id
exports.delete = (req, res)=>{};
