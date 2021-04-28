const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
//promises are async calls
mongoose.Promise = global.Promise;

const db={};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user.model.js")(mongoose);
db.questions = require("./question_model.js")(mongoose);
db.comments = require("./comment_model.js")(mongoose);
db.images = require("./image_model.js")(mongoose);
module.exports = db;
