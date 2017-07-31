var tokens = require('../_token.js');
var TelegramBot = require('node-telegram-bot-api');
var express = require('express');
var path = require('path');

var bot = new TelegramBot(tokens.BOT_TOKEN, {polling:true});
var app = express();

app.set('port', tokens.PORT || tokens.DEFAULT_PORT);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/game.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/game.js'));
});
app.get('/libs/*', (req, res) => {
    res.sendFile(path.join(__dirname + req.path));
});
app.get('/assets/*', (req, res) => {
    res.sendFile(path.join(__dirname + req.path));
});

app.get('/setscore/uid/:user_id/iid/:inline_id', (req, res) => {
    bot.setGameScore({
        'user_id' : req.params.user_id,
        'score' : score,
        'inline_message_id' : req.inline_id,
        'edit_message' : true
    });
});

app.listen(app.get('port'), () => {
    console.log("Listening on port:" + app.get('port'));
});