const mongoose = require("mongoose");
const Schema = mongoose.Schema;
module.exports = mongoose=>{
  const Question= mongoose.model(
    "question",
    mongoose.Schema(
      {
          title: {
            type: String,
            required: true,
          },
          content: String,
          createdAt: {
            type: Date,
            default: Date.now
          },
          _creator: {
            type: Schema.ObjectId,
            ref: 'User'
          },
          creatorName: {
            type: String,
            required: true,
          },
          _comments: [{
            type: Array
          }],
          image: {
            type: String,
            required: false
          }
      }
    )
  );
  return Question;
};
