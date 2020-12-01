const express = require('express');
const app = express();

const Players = require('./../controllers/player.controller');
const { verifyToken } = require('../middlewares/auth');


app.get('/API/player-leaderboard', verifyToken, Players.leaderBoard);

app.post('/API/player-signup', Players.signup);

app.post('/API/player-login', Players.login);

module.exports = app;