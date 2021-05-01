const mongoose = require("mongoose");
const Schema = mongoose.Schema;
module.exports = mongoose=>{
  const Comment= mongoose.model(
    "comment",
    mongoose.Schema(
      {
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date, default: Date.now,
        },
        _creator: {
          type: Schema.ObjectId, ref: 'User',
        },
        creatorName: {
          type: String,
          required: true
        },
        _post: {
          type: Schema.ObjectId, ref: 'Question',
        }
      }
    )
  );
  return Comment;
};
