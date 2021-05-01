var ObjectId = require('mongodb').ObjectID;
module.exports = mongoose=>{
  const User= mongoose.model(
    "user",
    mongoose.Schema(
      {
        email:{
          type: String,
          required: true,
          unique: true
        },
        password:{
          type: String,
        },
        username: String,
        firstname:String,
        lastname:String,
        status:Boolean,
        // connections:[{
        //   type: Array
        // }],
        connections: [String],
        // requests: [{
        //   type: Array
        // }],
        requests: [String],
        createAt: {
          type: Date,
          default: Date.now()
        }
      }
    )
  );
  return User;
};
