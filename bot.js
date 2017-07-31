const tokens = require('./_tokens.js');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(tokens.BOT_TOKEN, {polling:true});

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
        fs.readFile('CREDITS.md', (err, data) => {
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