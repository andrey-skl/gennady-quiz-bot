const TelegramBot = require('node-telegram-bot-api');
const questionsDatabase = require('./lib/questions-database');
const addTrollingMessages = require('./lib/trolling-messages');


//NOTE: You should get this file from one of our team
const BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

console.log('Authorizing and initializing the bot...');

bot.getMe()
    .then(me => {
        console.log('Bot has been successfully authorized. Name is', me.first_name);

        addTrollingMessages(bot);
        bot.on('text', msg => console.log('Message received|', msg.from.username, msg.text));

        return questionsDatabase('./questions-database/questions-test.txt');
    })
    .then(questions => {
        console.log('Questions has been loaded', questions);
    });