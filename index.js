var tokens = require('./_token.js');
var fs = require('fs');
var Telegraf = require('telegraf');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var bot = new Telegraf(tokens.BOT_TOKEN);
var app = express();

app.set('port', tokens.PORT || tokens.DEFAULT_PORT);
app.use(express.static(path.join(__dirname + '/html')));
app.use(bot.webhookCallback('/bot'+tokens.BOT_TOKEN));

bot.telegram.setWebhook(tokens.WEBHOOK+"bot"+tokens.BOT_TOKEN);
 
bot.gameQuery((ctx) => {
    var uid = ctx.from.id;
    var msgid = ctx.callbackQuery.message.message_id;
    var chatid = ctx.chat.id;
    
    var url =   tokens.GAME_URL + "?uid=" + uid + 
                "&chatid=" + chatid + "&msgid=" + msgid;
    ctx.answerGameQuery(url);
});

bot.command(['/start', '/help'], (ctx) => {
     var reply =    "Hi! This is the bot for Three Tap Heroes.\n" +
                    "Commands:\n" +
                    "- /help Shows this message\n" +
                    "- /instructions Prints the instructions for the game\n" +
                    "- /credits Shows the credits\n" +
                    "- /game Sends the game";
    ctx.reply(reply);
});

bot.command('/instructions', (ctx) => {
    var reply = "Three young heroes are standing between an army of monsters and " +
                "the innocent villagers! Help them coordinating their attacks to repel " +
                "the enemies. But beware! Only the frontmost enemy can be damaged. " +
                "If you miss and hit another target, you will loose hearts! If you run " +
                "out of hearts or the enemy reaches the heroes, it's Game Over!";
    ctx.reply(reply);
});

bot.command('/credits', (ctx) => {
    fs.readFile('./CREDITS.md', 'utf8', (err, data) => {
        var answer = err ? "Somebody stole the CREDITS! Please wait while we call the Web Police" : data;
        ctx.reply(answer);
    });
});

bot.command('/game', (ctx) => {
    ctx.replyWithGame(tokens.GAME_NAME);
});

app.get(['/index.html', '/'], (req, res) => {
    res.sendFile('/index.html');
});
app.get('/game.js', (req, res) => {
    res.sendFile('/game.js');
});
app.get('/libs/*', (req, res) => {
    res.sendFile(req.path);
});
app.get('/assets/*', (req, res) => {
    res.sendFile(req.path);
});

app.get('/setscore/uid/:user_id/chat/:chat_id/msg/:msg_id/score/:score', (req, res) => {
    bot.telegram.setGameScore(req.params.user_id, req.params.score, null, req.params.chat_id, req.params.msg_id);
});

app.listen(app.get('port'), () => {
    console.log("Listening on port:" + app.get('port'));
});
