<?php
require "vendor/autoload.php";
use Telegram\Bot\Api;
include("_token.php");

$telegram = new Api($BOT_TOKEN);

$update = $telegram->getWebhookUpdates();
$callback_id = $update->getCallbackQuery() ? $update->getCallbackQuery()->getId() : "";

if (!$callback_id) {
    $msg = $update->getMessage();
    $cmd = $msg->getText();
    $chat_id = $update->getChat()->getId();
    
    error_log("msg is: ".$cmd);
    if (strcmp($cmd, "/start") == 0 || strcmp($cmd, "/help") == 0) {
        $telegram->sendMessage(['chat_id' => $chat_id, 'text' => 
                               "Hi! This is the bot for Three Tap Heroes.\n".
                               "Commands:\n".
                               "- /help Shows this message\n".
                               "- /credits Shows the credits\n".
                               "- /game Sends the game"]);
    } else if (strcmp($cmd, "/credits") == 0) {
        $credits = fopen("CREDITS.md", "r") or die("Somebody stole the CREDITS! Please wait while we call the Web Police");
        $ans = "";
        while (!feof($credits)) {
            $ans = $ans.fgets($credits);
        }
        $telegram->sendMessage(['chat_id' => $chat_id, 'text' => $ans]);
    } else if (strcmp($cmd, "/game") == 0) {
        $telegram->sendGame(['chat_id' => $chat_id, 'game_short_name' => 'threetapheroes']);
    }
    
} else {
    $inlineQuery = $update->inlineQuery;
    $url = "https://threetapheroes.herokuapp.com/index.html?uid="
                                    .$update['callback_query']['from']['id']."&iid="
                                    .$update['callback_query']['inline_message_id'];
    $telegram->answerCallbackQuery(['callback_query_id' => $callback_id, 
                                    'url' => $url]);
}