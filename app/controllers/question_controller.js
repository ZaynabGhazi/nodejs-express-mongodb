const db = require("../models");
const fs = require('fs');
var path = require('path');
const Question = db.questions;

module.exports = {
  question: function(req, res) {
    const {
      title,
      content,
      userId,
      userName,
    } = req.body;
    if (req.file) {
    const img =  {
            data: fs.readFileSync(path.join(__dirname + '../../../uploads/' + req.file.filename)),
            contentType: 'image/*'
        }

const post = null;
     post = new Question({
      title: title,
      content: content,
      _creator: userId,
      creatorName: userName,
      image: img
    });
  } else {
     post = new Question({
      title: title,
      content: content,
      _creator: userId,
      creatorName: userName
        });
  }

    post.save().then((newQuestion) => {
      return res.status(200).json({
        success: true,
        data: newQuestion
      });
    }).catch((err) => {
      return res.status(500).json({
        message: err
      });
    })
  },
  getAll: function(req, res) {
    Question.find({})
    .then((questions) => {
      return res.status(200).json({
        success: true,
        data: questions
      })
    }). catch((err) => {
      return res.status(500).json({
        message: err
      });
    })
  },
  getById: function(req, res) {
    const id = req.query.id;
    Question.findById(id)
    .then((question) => {
      return res.status(200).json({
        success: true,
        data: question._comments
      })
    }).catch((err) => {
      return res.status(500).json({
        message: err
      });
    })
  }
};
