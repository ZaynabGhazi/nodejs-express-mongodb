const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
})
const upload = multer({storage: storage});

module.exports = app =>{
  const userController = require('../controllers/user.controller.js');
  const questionController = require('../controllers/question_controller.js');
  const commentController = require('../controllers/comment_controller.js');
  var router = require("express").Router();
  router.post('/post_question', upload.single('productImage'), questionController.question);
  router.get('/questions', questionController.getAll);
  router.get('/getById', questionController.getById);
  router.post('/post_comment', commentController.post);
  app.use('/api/question',router);
}
