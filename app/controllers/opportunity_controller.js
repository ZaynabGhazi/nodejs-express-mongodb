const db = require("../models");
const fs = require('fs');
var path = require('path');
const Opportunity = db.opportunities;

module.exports = {
  opportunity: function(req, res) {
    const { title, company, industry, description, link, sponsorship, yoe, target, location, deadline, type
    } = req.body;
     post = new Opportunity({
        title: title,
        company: company,
        industry: industry,
        description: description,
        link: link,
        sponsorship: sponsorship,
        yoe: yoe,
        target: target,
        location: location,
        deadline: deadline,
        type: type
    });

    post.save().then((newOpportunity) => {
      return res.status(200).json({
        success: true,
        data: newOpportunity
      });
    }).catch((err) => {
      return res.status(500).json({
        message: err
      });
    })
  },
  getAll: function(req, res) {
    Opportunity.find({})
    .then((opportunities) => {
      return res.status(200).json({
        success: true,
        data: opportunities
      })
    }). catch((err) => {
      return res.status(500).json({
        message: err
      });
    })
  },
};
