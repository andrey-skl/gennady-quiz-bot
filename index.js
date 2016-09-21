var TelegramBot = require('node-telegram-bot-api');
var addTrollingMessages = require('./lib/trolling-messages');
//NOTE: You should get this file from one of our team
var BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

console.log('Authorizing and initializing the bot...');
bot.getMe().then(me => {
    console.log('Bot has been successfully authorized. Name is', me.first_name);
});

addTrollingMessages(bot);

// Any kind of message
bot.on('message', msg => {
    console.log('Message received|', msg.from.username, msg.text);
    if (msg.text.indexOf('Гена') !== -1) {
        bot.sendMessage(msg.chat.id, `Отстань от меня, ${msg.from.first_name}!!`);
    }
});