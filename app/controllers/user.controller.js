const db = require("../models");
//hash passwords
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validationResult = require("express-validator").validationResult;
const User = db.users;
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
const { query } = require("express-validator");

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

exports.searchUserByFirstname = (req,res) =>{
  try{
    User.find({"firstname":req.query.firstname}).then(data=>{
      console.log("in search user!");
      console.log(req.query.firstname);
      console.log(data[0].firstname);
      console.log(data[0]);
      if (!data){
      res.status(502).json({
      message: "Error fetching user by firstname!"});
      }
      else res.json(data);
    });
  } catch(e){
    res.send({
      message: "Error fetching user by firstname!"});
  }
}

exports.searchUserByFirstnameWeb = (req,res) =>{
  try{
    if(req.body.attribute == "firstname"){
      User.find({"firstname": req.body.input}).then(data=>{
        console.log("in search user web!");
        if (!data){
        console.log("no data");
        res.status(502).json({
        message: "Error fetching user by firstname!"});
        }
        else {
          console.log(data);
          res.render('search_result', result = data)}
      });
    }
    else{
      User.find({"lastname": req.body.input}).then(data=>{
        console.log("in search user web!");
        if (!data){
        console.log("no data");
        res.status(502).json({
        message: "Error fetching user by lastname!"});
        }
        else {
          console.log(data);
          res.render('search_result', result = data)}
      });

    }
  } catch(e){
    res.send({
      message: "Error fetching user by firstname!"});
  }
}

exports.findUserWeb = (req, res) => {
  res.render('user_search');
}


exports.searchUserByLastName = (req,res) =>{
  try{
    User.find({"lastname":req.query.lastname}).then(data=>{
      console.log("in search user!");
      console.log(req.query.lastname);
      console.log(data[0].lastname);
      console.log(data[0]);
      if (!data){
      res.status(502).json({
      message: "Error fetching user by lastname!"});
      }
      else res.json(data);
    });
  } catch(e){
    res.send({
      message: "Error fetching user by lastname!"});
  }
}

exports.sendConnectRequest = (req, res) => {
  //assume req has userid and the id of the receiver
  console.log("in sendConnectRequest!");
  console.log(req.query);
  console.log(req.query.id_sender);
  console.log(req.query.id_receiver);
  //var xyz = mongoose.Types.ObjectId("shu37gdvkj238");
  var id_sender = (mongoose.Types.ObjectId)(req.query.id_sender);
  var id_receiver =(mongoose.Types.ObjectId)(req.query.id_receiver);
  console.log("!!!!!!!!!");
 
  try{
    console.log("#########");

    /******DO NOT DELETE THE COMMENTED CODE ******************/
    // User.findById(id_receiver).find({requests: id_sender}).then(data =>{ //check if user is in requests list already; if yes, return
    //   if(data){
    //     console.log("error1!!!");
    //     res.status(400).json({
    //       message: "sender already in requests!"});
    //       }
    //       else{
    //         User.findById(id_receiver).find({connections: id_sender}).then(data =>{ //check if user is in connection list already; if yes, return
    //           if(data){
    //             console.log("error2!!!");
    //             res.status(400).json({
    //               message: "sender already in connections!"});
    //               }
     //              else{
                     User.findByIdAndUpdate(id_receiver, {$push:{requests: id_sender}},{upsert:true},function(err, docs){
                       if(err){
                        console.log(err);
                       }else{
                        console.log("updated:", docs);
                        res.send({
                          message: "Connect Succeeds!"});
                       }
                     });//.then(data =>{
                    //   console.log("here!");
                    //   console.log(data);
                    //   res.send({
                    //     message: "Send request succeeds!"});
                    // }).catch((err)=>{
                    //   console.log("@@@@@@@@");
                    //   res.status(400).json({
                    //     message: "could not update"});
                    // }); // add the sender's id to the receiver's requests
                    // res.send({
                    // message: "Send request succeeds!"});
              
                  //}
             // });
         // }
      //});

    }catch(e){
      console.log("error3!!!");
      res.send({
        message: "Error sending request!"});
    }

}

exports.sendConnectRequestWeb = (req, res) => {
  //assume req has userid and the id of the receiver
  console.log("in sendConnectRequestWeb!");
  var id_sender = (mongoose.Types.ObjectId)(req.body.id_sender);
  var id_receiver =(mongoose.Types.ObjectId)(req.body.id_receiver);
  try{
    User.findByIdAndUpdate(id_receiver, {$push:{requests: id_sender}},{upsert:true},function(err, docs){
      if(err){
        console.log(err);
      }else{
        console.log("updated:", docs);
        res.render('connect_feedback', result = {
             message: "Connect Request Sent!"})}
      }
    );

    }catch(e){
      console.log("error3!!!");
      res.send({
        message: "Error sending request!"});
    }

}


exports.acceptConnectRequest = (req, res) => {
  //assume req has userid and the id of the sender

  var id_sender = (mongoose.Types.ObjectId)(req.query.id_sender);
  var id_receiver =(mongoose.Types.ObjectId)(req.query.id_receiver);
  try{
    // User.update({"_id":req.query.id_user}, {$push:{connections: req.query.id_sender}}); // add the sender into user's network.
    // User.update({"_id":req.query.id_sender}, {$push:{connections: req.query.id_user}}); // add user to the sender's network.
    // User.update({"_id": req.query.id_user}, {$pull: {requests: req.query.id_sender}}); // delete the sender's request from the user's request lists. 

    User.findByIdAndUpdate(id_receiver, {$push:{connections: id_sender}},{upsert:true},function(err, docs){
      if(err){
      console.log("HELLO!!!");
       console.log(err);
      }else{
       console.log("updated:", docs);
       res.send({
        message: "Connect Succeeds!"});
      //  res.send({
      //    message: "Connect Succeeds!"});    
       }
    });

    User.findByIdAndUpdate(id_sender, {$push:{connections: id_receiver}},{upsert:true},function(err, docs){
      if(err){
      console.log("HELLO");
       console.log(err);
      }else{
       console.log("updated:", docs);
      //  res.send({
      //    message: "Connect Succeeds!"});    
       }
    });

    User.findByIdAndUpdate(id_receiver, {$pull:{requests: id_sender}},function(err, docs){
      if(err){
       console.log(err);
      }else{
       console.log("updated:", docs);
      //  res.send({
      //    message: "Connect Succeeds!"});    
       }
    });

  } catch(e){
    res.send({
      message: "Error accepting request!"});
  }
}

//For next iteration
exports.rejectConnectRequest = (req, res) => {
  //assume req has userid and the id of the sender
  try{
    User.update({"_id": req.query.id_user}, {$pull: {requests: req.query.id_sender}}); // delete the sender's request from the user's request lists. 
  } catch(e){
    res.send({
      message: "Error rejecting request!"});
  }
}

exports.notify = (req, res)=>{
  try{
    User.find({ "_id": { "$in": req.query.request}}).then(data=>{
      if(!data){
        res.status(502).json({
        message: "Error fetching user by firstname!"});
        }
      else{
        res.json(data);
      }
    })
  }catch(e){
    res.send({
      message: "Error fetching users!"});
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
