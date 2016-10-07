<?php
//Load this page to register the desired Webhook (set the Webhook URL in _token.php)
require "vendor/autoload.php";
use Telegram\Bot\Api;
include("_token.php");

$telegram = new Api($BOT_TOKEN);

$result = $telegram->setWebhook($WEBHOOK);
print_r($result);
?>