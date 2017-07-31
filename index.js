var tokens = require('./_token.js');
var TelegramBot = require('node-telegram-bot-api');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var bot = new TelegramBot(tokens.BOT_TOKEN, {polling:true, webhook: { port: tokens.PORT || tokens.DEFAULT_PORT }});
var app = express();

app.set('port', tokens.PORT || tokens.DEFAULT_PORT);
app.use(express.static(path.join(__dirname + '/html')));
app.use("/bot"+tokens.BOT_TOKEN, bodyParser.json());

bot.setWebHook();
bot.setWebHook(tokens.WEBHOOK+"/bot"+tokens.BOT_TOKEN);
 
bot.on('callbackQuery', (query) => {
    var url =   tokens.GAME_URL + "?uid=" + query.from.id + 
                "&iid=" + query.inline_message_id;
    bot.answerCallbackQuery({
        'callback_query_id' : query.id,
        'url' : url
    });
});

bot.on('message', (msg) => {
    var text = msg.text;
    var chatId = msg.chat.id;
    
    if (text === "/start" || text === "/help") {
        bot.sendMessage({
            'chat_id' : chatId,
            'text' :    "Hi! This is the bot for Three Tap Heroes.\n" +
                        "Commands:\n" +
                        "- /help Shows this message\n" +
                        "- /instructions Prints the instructions for the game\n" +
                        "- /credits Shows the credits\n" +
                        "- /game Sends the game"
        });
    }
    else if (text === "/instructions") {
        bot.sendMessage({
            'chat_id' : chatId,
            'text' :    "Three young heroes are standing between an army of monsters and " +
                        "the innocent villagers! Help them coordinating their attacks to repel " +
                        "the enemies. But beware! Only the frontmost enemy can be damaged. " +
                        "If you miss and hit another target, you will loose hearts! If you run " +
                        "out of hearts or the enemy reaches the heroes, it's Game Over!"
        });
    }
    else if (text === "/credits") {
        fs.readFile('../CREDITS.md', (err, data) => {
            var answer = err ? "Somebody stole the CREDITS! Please wait while we call the Web Police" : data;
            bot.sendMessage({
                'chat_id' : chatId,
                'text' : answer
            });
        });
    }
    else if (text === "/game") {
        bot.sendGame({
            'chat_id' : chatId,
            'game_short_name' : tokens.GAME_NAME
        });
    }
});

bot.setWebHook(tokens.WEBHOOK+"/bot"+tokens.BOT_TOKEN);
 
bot.on('callbackQuery', (query) => {
    var url =   tokens.GAME_URL + "?uid=" + query.from.id + 
                "&iid=" + query.inline_message_id;
    bot.answerCallbackQuery({
        'callback_query_id' : query.id,
        'url' : url
    });
});

bot.on('message', (msg) => {
    var text = msg.text;
    var chatId = msg.chat.id;
    
    if (text === "/start" || text === "/help") {
        bot.sendMessage(chatId,
                        "Hi! This is the bot for Three Tap Heroes.\n" +
                        "Commands:\n" +
                        "- /help Shows this message\n" +
                        "- /instructions Prints the instructions for the game\n" +
                        "- /credits Shows the credits\n" +
                        "- /game Sends the game"
        );
    }
    else if (text === "/instructions") {
        bot.sendMessage(chatId,
                        "Three young heroes are standing between an army of monsters and " +
                        "the innocent villagers! Help them coordinating their attacks to repel " +
                        "the enemies. But beware! Only the frontmost enemy can be damaged. " +
                        "If you miss and hit another target, you will loose hearts! If you run " +
                        "out of hearts or the enemy reaches the heroes, it's Game Over!"
        );
    }
    else if (text === "/credits") {
        fs.readFile('../CREDITS.md', (err, data) => {
            var answer = err ? "Somebody stole the CREDITS! Please wait while we call the Web Police" : data;
            bot.sendMessage(chatId, answer);
        });
    }
    else if (text === "/game") {
        bot.sendGame(chatId, tokens.GAME_NAME);
    }
});

app.get('/', (req, res) => {
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

app.get('/setscore/uid/:user_id/iid/:inline_id/score/:score', (req, res) => {
    bot.setGameScore(req.params.user_id, req.params.score,
        {
            'inline_message_id' : req.params.inline_id,
            'edit_message' : true
        }
    );
});

app.post("/bot"+tokens.BOT_TOKEN, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(app.get('port'), () => {
    console.log("Listening on port:" + app.get('port'));
});
