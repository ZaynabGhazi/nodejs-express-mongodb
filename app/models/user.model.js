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
        createAt: {
          type: Date,
          default: Date.now()
        }
      }
    )
  );
  return User;
};
