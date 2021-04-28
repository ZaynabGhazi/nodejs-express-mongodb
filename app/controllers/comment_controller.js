var db = require('./../models');
const Comment = db.comments;

module.exports = {
  post: function(req, res) {
    const { userId, questionId, text, creatorName} = req.body;
    const comment = new Comment({
      text: text,
      _creator: userId,
      _question: questionId,
      creatorName: creatorName
    });

    comment.save()
    .then((newComment) => {
      db.questions.findByIdAndUpdate(
        questionId,
        { $push: { '_comments': {'commentId': newComment._id, 'creatorName': creatorName, 'content': text, 'createdAt': newComment.createdAt}}}
      ).then((existingQuestion) => {
        res.status(200).json({
          success: true,
          data: newComment,
          existingQuestion,
        });
      }).catch((err) => {
      res.status(500).json({
        message: err,
      });
    });
  });
}
}
