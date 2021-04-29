module.exports = app =>{
  const userController = require('../controllers/user.controller.js');
  const questionController = require('../controllers/question_controller.js');
  const commentController = require('../controllers/comment_controller.js');
  var router = require("express").Router();
  router.post('/post_question', questionController.question);
  router.get('/questions', questionController.getAll);
  router.get('/getById', questionController.getById);
  router.post('/post_comment', commentController.post);
  app.use('/api/question',router);
}
