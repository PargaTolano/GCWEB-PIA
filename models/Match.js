const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    player1:{
        type: mongoose.Schema.Types.String,
        ref: "player",
        required: true
    },
    player2:{
        type: mongoose.Schema.Types.String,
        ref: "player",
        required: true
    },
    map:{
        type: mongoose.Schema.Types.String,
        require: true
    },
    winner:{
        type: mongoose.Schema.Types.String,
        ref: "player",
        required: true
    }
});

module.exports = Subject = mongoose.model("match", MatchSchema);