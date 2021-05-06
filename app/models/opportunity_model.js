const mongoose = require("mongoose");
const Schema = mongoose.Schema;
module.exports = mongoose=>{
  const Opportunity= mongoose.model(
    "opportunity",
    mongoose.Schema(
      {
          title: {
            type: String,
            required: true,
          },
          company: {
            type: String,
            required: true,
          },
          industry: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
          link: {
            type: String,
            required: true,
          },
          sponsorship: {
            type: String,
            required: true,
          },
          yoe: {
            type: String,
            required: true,
          },
          target: {
            type: String,
            required: true,
          },
          location: {
            type: String,
            required: true,
          },
          deadline: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
      }
    )
  );
  return Opportunity;
};
