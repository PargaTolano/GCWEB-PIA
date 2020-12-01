const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    tag:{
        type:   String,
        unique:   true,
        required: true
    },
    password:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    score:{
        type: mongoose.Schema.Types.Number,
        default: 0
    }
});

module.exports =  mongoose.model("player", PlayerSchema);