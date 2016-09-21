var TelegramBot = require('node-telegram-bot-api');
var BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

// Setup polling way
var bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

// Any kind of message
bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    // photo can be: a file path, a stream or a Telegram file_id
    var photo = 'cats.png';
    bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
});