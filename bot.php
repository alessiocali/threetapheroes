<?php
/*
    File: bot.php
    This script implements the bot logic to answer game callbacks and some simple queries,
    like printing the instructions or sending the game itself.
    
    Author: Alessio Giuseppe Calì
*/
require "vendor/autoload.php";
use Telegram\Bot\Api;
include("_token.php");

$telegram = new Api($BOT_TOKEN);

$update = $telegram->getWebhookUpdates();

// Check if this is a callback query
$callback_id = $update->getCallbackQuery() ? $update->getCallbackQuery()->getId() : "";

if (!$callback_id) {    // No callback. Answer simple queries.
    $msg = $update->getMessage();
    $cmd = $msg->getText();
    $chat_id = $update->getChat()->getId();
    
    if (strcmp($cmd, "/start") == 0 || strcmp($cmd, "/help") == 0) {    // Send the help message
        $telegram->sendMessage(['chat_id' => $chat_id, 'text' => 
                               "Hi! This is the bot for Three Tap Heroes.\n".
                               "Commands:\n".
                               "- /help Shows this message\n".
                               "- /instructions Prints the instructions for the game\n"
                               "- /credits Shows the credits\n".
                               "- /game Sends the game"]);
    } else if (strcmp($cmd, "/instructions") == 0) {    // Send the instructions
        $telegram->sendMessage(['chat_id' => $chat_id, 'text' =>
                               "Three young heroes are standing between an army of monsters and".
                               "the innocent villagers! Help them coordinating their attacks to repel ".
                               "the enemies. But beware! Only the frontmost enemy can be damaged. ".
                               "If you miss and hit another target, you will loose hearts! If you run ".
                               "out of hearts or the enemy reaches the heroes, it's Game Over!"]);
    } else if (strcmp($cmd, "/credits") == 0) {     // Print the content of CREDITS.md
        $credits = fopen("CREDITS.md", "r") or die("Somebody stole the CREDITS! Please wait while we call the Web Police");
        $ans = "";
        while (!feof($credits)) {
            $ans = $ans.fgets($credits);
        }
        $telegram->sendMessage(['chat_id' => $chat_id, 'text' => $ans]);
    } else if (strcmp($cmd, "/game") == 0) {
        $telegram->sendGame(['chat_id' => $chat_id, 'game_short_name' => 'threetapheroes']);
    }
} else {    // Callback query. Answer with the game's URL
    $inlineQuery = $update->inlineQuery;
    // User ID and inline message ID are sent to index.html through GET
    $url = "https://threetapheroes.herokuapp.com/index.html?uid="
                                    .$update['callback_query']['from']['id']."&iid="
                                    .$update['callback_query']['inline_message_id'];
    $telegram->answerCallbackQuery(['callback_query_id' => $callback_id, 
                                    'url' => $url]);
}