<?php
require "vendor/autoload.php";
use Telegram\Bot\Api;
include("_token.php");

if (isset($_POST['score'], $_POST['uid'], $_POST['iid'])) {
    $telegram = new Api($BOT_TOKEN);
    $result = $telegram->setGameScore(array('user_id' => $_POST['uid'], 'score' => $_POST['score'], 'inline_message_id' => $_POST['iid'], 'edit_message' => true));
    error_log(json_encode($result));
}