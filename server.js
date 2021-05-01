const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
var corsOpt = {
  origin:"http://localhost:3000"
};
app.use(cors(corsOpt));
app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.get("/",(req,res)=>{
  res.json({message:"Server for elevate running."})
});

//port setup
require("./app/routes/user.routes")(app);
require("./app/routes/post_routes")(app);
const PORT = 3000;
app.listen(PORT,()=>{
  console.log('Elevate server is running on port '+ PORT);
});


//db setup
const db = require("./app/models");
db.mongoose.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log(("Connected to the cloud db!"));
}).catch(err=>{
  console.log("Cannot connect to cloud db!",err);
  process.exit();
});
