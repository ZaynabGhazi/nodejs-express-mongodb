const jwt = require("jsonwebtoken");

module.exports = function(req,res,next){
    const token = req.header("token");
    if (!token) return res.status(401).json({
    message: "Authentication error!"});
    try{
        const decoded = jwt.verify(token,"secretToken");
        req.user = decoded.user;
        next();
    }
    catch(e){
    console.error(e);
    res.status(503).send({
    message: "Invalid token!"});
    }
};