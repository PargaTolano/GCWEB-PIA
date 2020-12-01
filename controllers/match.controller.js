const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Matches = require('./../models/Match');

/**
 * @function getMatches
 * @param {HttpRequest} req 
 * @param {HTtpResponse} res 
 */
let getMatches = (req, res)=>{
    Matches.find({})
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
 * @function getMatchesWithPlayer
 * @param {HttpRequest} req 
 * @param {HTtpResponse} res 
 */
let getMatchesWithPlayer = (req,res)=>{

    let tag = req.params.tag;

    Matches.find({$or:[{player1:tag}, {player2:tag}]})
    .exec((err, data)=>{

        if(err){
            return res.json({
                status:500,
                message:"Internal server error",
                err
            });
        }

        return res.json({
            status:200,
            data
        });
    });
};

/**
 * @function getMatchesWon
 * @param {HttpRequest} req 
 * @param {HTtpResponse} res 
 */
let getMatchesWon = (req,res)=>{

    let tag = req.params.tag;

    Matches.find({$or:[{player1:tag, winner:tag}, {player2:tag, winner:tag}]})
    .exec((err, data)=>{

        if(err){
            return res.json({
                status:500,
                message:"Internal server error",
                err
            });
        }

        return res.json({
            status:200,
            data
        });
    });
};

module.exports = {
    getMatches,
    getMatchesWithPlayer,
    getMatchesWon
}