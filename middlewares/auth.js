const jwt = require('jsonwebtoken');

let verifyToken = (req,res,next)=>{

    let token = req.get('Authorization');

    console.log(req.headers);
    console.log(token)

    jwt.verify(token, process.env.SECRET, (err,decoded)=>{

        if(err){
            return res.json({
                status:401,
                message:"Autorization Token Not Valid"
            });
        }

        req.user = decoded.user;

        next();
    });
}

module.exports = {
    verifyToken
}