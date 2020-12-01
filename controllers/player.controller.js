const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Players = require('./../models/Player');

const maxLeaderboardLength = 100;

/**
 * @function leaderBoard Function to get the players leaderboard
 * @param {HttpRequest} req 
 * @param {HTtpResponse} res 
 */
let leaderBoard = (req, res)=>{
    Players.find({})
    .sort({score:-1})
    .limit(maxLeaderboardLength)
    .exec((err,data)=>{

        if(err){
            res.json({
                status: 500,
                message: "Internal Server Error"
            });
        }
        else{
            res.json({
                status: 200,
                data,
                message: "OK :)"
            });
        }
    });
};

/**
 * @function signup
 * @param {HttpRequest} req 
 * @param {HTtpResponse} res 
 */
let signup = (req,res)=>{

    let body = req.body;

    console.log(body)

    let player = new Players({
        tag:body.tag,
        password:bcrypt.hashSync(body.password,10)
    });

    player.save((err,data)=>{

        if(err){
            return res.json({
                status:400,
                message:"Error on register",
                err
            });
        }

        res.json({
            status:200,
            data,
            message:"Sign Up successful!"
        });
    });
};

/**
 * @function login Function to manage the player login request
 * @param {HttpRequest} req 
 * @param {HTtpResponse} res 
 */
let login = (req,res)=>{
    let body = req.body;

    Players.findOne({tag:body.tag})
    .exec((err, data)=>{

        if(err){
            return res.json({
                status:500,
                message:"Internal Server Error",
                err
            });
        }

        if( !bcrypt.compareSync(body.password, data.password)){

            return res.json({
                status: 400,
                message:"Wrong Password"
            });
        }

        let token = jwt.sign({data}, process.env.SECRET, {expiresIn:process.env.EXPIRE})

        res.json({
            status:200,
            token
        });
    });
};

module.exports = {
    leaderBoard,
    signup,
    login
}