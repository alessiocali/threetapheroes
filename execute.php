<?php
require "vendor/autoload.php";
use Telegram\Bot\Api;
include("_token.php");

$telegram = new Api($BOT_TOKEN);

$updates = $telegram->getWebhookUpdates();

$msg = "Hi! This bot is currently a Work in Progress. Please stay tuned!";

foreach ($updates as $update) {
    $chat_id = $update->getMessage()->getChat()->getId();
    $telegram->sendMessage(['chat_id' => $chat_id, 'text' => $msg]);
}