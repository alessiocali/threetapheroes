<?php
require "vendor/autoload.php";
use Telegram\Bot\Api;
include("_token.php");

$telegram = new Api($BOT_TOKEN);

$update = $telegram->getWebhookUpdates();
$callback_id = $update->getCallbackQuery() ? $update->getCallbackQuery()->getId() : "";

if (!$callback_id) {
    $msg = "Hi! This bot is currently a Work in Progress. Please stay tuned!";

    $chat_id = $update->getMessage()->getChat()->getId();
    $telegram->sendMessage(['chat_id' => $chat_id, 'text' => $msg]);    
} else {
    $inlineQuery = $update->inlineQuery;
    error_log(json_encode($update));
    $url = "https://threetapheroes.herokuapp.com/index.html?uid="
                                    .$update['callback_query']['from']['id']."&iid="
                                    .$update['callback_query']['inline_message_id'];
    $telegram->answerCallbackQuery(['callback_query_id' => $callback_id, 
                                    'url' => $url]);
}