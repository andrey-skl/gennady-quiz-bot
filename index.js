const TelegramBot = require('node-telegram-bot-api');
const questionsDatabase = require('./lib/questions-database');
const addTrollingMessages = require('./lib/trolling-messages');
const botMessagesLogger = require('./lib/bot-messages-logger');


//NOTE: You should get this file from one of our team
const BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

console.log('Authorizing and initializing the bot...');

bot.getMe()
    .then(me => {
        console.log('Bot has been successfully authorized. Name is', me.first_name);
        addTrollingMessages(bot);
        botMessagesLogger(bot);

        return questionsDatabase('./questions-database/questions-test.txt');
    })
    .then(questions => {
        console.log('Questions has been loaded, there are ', questions.length, 'questions.');

        bot.on('text', msg => {
            if (msg.text !== 'Гена, дай вопрос') {
                return;
            }
            const randomQuestion = questions[Math.floor(Math.random()*questions.length)];
            bot.sendMessage(msg.chat.id, JSON.stringify(randomQuestion));
        });
    });