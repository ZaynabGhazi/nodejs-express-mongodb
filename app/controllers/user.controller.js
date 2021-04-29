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
    res.status(400).send({message: "Content cannot be empty!"});
    return;
  }
  //check validator result
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({
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
        return res.status(400).json({mssg: "User Already Exists!"});
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
        res.status(501).send({
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
                                  res.status(200).json({
                                  token});
                                  })

                               }).catch(err=>{
                                  res.status(500).send({
                                    message: err.message || "Error creating new user"
                                  });
                                });
            });

});

  }
    catch(err){
      console.log(err.message);
      res.status(500).send("Signup error");
    }

};

//user login
exports.login = (req, res)=>{
      if (!req.body.email){
        res.status(400).send({message: "Content cannot be empty!"});
        return;
      }
        const errors = validationResult(req);
        if (!errors.isEmpty()){
          return res.status(400).json({
            errors: errors.array()
          });
        }
        const { email, password} = req.body;
        try{
            User.findOne({
            email: req.body.email}).then(data =>{
                if (!data){
                res.status(400).json({
                message: "User does not exist!"});
                }
                bcrypt.compare(password,data.password,(err,isMatch)=>{
                    if (err || !isMatch){

                        res.status(400).json({
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
                           res.status(200).json({
                           token});
                           })
                          })
                         })
  } catch(e){
    console.error(e);
    res.status(500).json({
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
        res.status(502).json({
        message: "Error fetching current user!"});
        }
        else res.json(data);
        });
    } catch(e){
    res.send({
    message: "Error fetching user!"});
  }
}

exports.searchUser = (req,res) =>{
  try{
    User.find({"firstname":req.query.firstname}).then(data=>{
      console.log("in search user!");
      console.log(req.query.firstname);
      console.log(data[0].firstname);
      console.log(data[0]);
      if (!data){
      res.status(502).json({
      message: "Error fetching alice!"});
      }
      else res.json(data);
    });
  } catch(e){
    res.send({
      message: "Error fetching alice!"});
  }
}

exports.sendConnectRequest = (req, res) => {
  //assume req has userid and the id of the receiver
  try{
    User.update({"_id":req.query.id_receiver}, {$push:{requests: req.query.id_user}});
  } catch(e){
    res.send({
      message: "Error sending request!"});
  }
}

exports.acceptConnectRequest = (req, res) => {
  //assume req has userid and the id of the sender
  try{
    User.update({"_id":req.query.id_user}, {$push:{connections: req.query.id_sender}}); // add the sender into user's network.
    User.update({"_id":req.query.id_sender}, {$push:{connections: req.query.id_user}}); // add user to the sender's network.
    User.update({"_id": req.query.id_user}, {$pull: {requests: req.query.id_sender}}); // delete the sender's request from the user's request lists. 
  } catch(e){
    res.send({
      message: "Error accepting request!"});
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
