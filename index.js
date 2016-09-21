var TelegramBot = require('node-telegram-bot-api');
//NOTE: You should get this file from one of our team
var BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

// Any kind of message
bot.on('message', msg => {
    var chatId = msg.chat.id;

    bot.sendMessage(chatId, 'Hello!');
});