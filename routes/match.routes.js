const express = require('express');
const app = express();

const Matches = require('./../controllers/match.controller');
const { verifyToken } = require('../middlewares/auth');


app.get('/API/match-all', verifyToken, Matches.getMatches);

app.post('/API/match-with', verifyToken, Matches.getMatchesWithPlayer);

app.post('/API/match-won', verifyToken, Matches.getMatchesWon);

module.exports = app;