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
    $telegram->answerCallbackQuery(['callback_query_id' => $callback_id, 'url' => "https://threetapheroes.herokuapp.com/"]);
}