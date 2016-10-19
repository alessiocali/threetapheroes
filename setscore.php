<?php
/*
    File: setscore.php
    Updates Telegram's leaderboard with a new user score. Required data must be POSTed.
    Requires: 
        $_POST['uid'] : The user's ID.
        $_POST['iid'] : The Inline Message ID from the original callback request.
        $_POST['score'] : The new score. Must be positive and greater then the previous score.
        
    Author: Alessio Giuseppe Calì
*/
require "vendor/autoload.php";
use Telegram\Bot\Api;
include("_token.php");

if (isset($_POST['score'], $_POST['uid'], $_POST['iid'])) {
    $telegram = new Api($BOT_TOKEN);
    $result = $telegram->setGameScore(array('user_id' => $_POST['uid'], 'score' => $_POST['score'], 'inline_message_id' => $_POST['iid'], 'edit_message' => true));
} else {
    die("Not enough parameters.");
}