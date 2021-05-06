module.exports = app =>{
  const opportunityController = require('../controllers/opportunity_controller.js');
  var router = require("express").Router();
  router.post('/post_opportunity', opportunityController.opportunity);
  router.get('/opportunities', opportunityController.getAll);
  app.use('/api/opportunity',router);
}
