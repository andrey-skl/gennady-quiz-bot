const TelegramBot = require('node-telegram-bot-api');
const questionsDatabase = require('./lib/questions-database');
const addTrollingMessages = require('./lib/trolling-messages');
const botMessagesLogger = require('./lib/bot-messages-logger');


//NOTE: You should get this file from one of our team
const BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

console.log('Authorizing and initializing the bot...');

const games = {};

const jjj = {
  'huston007': 'Андрей',
  'vomixamxam': 'Макс',
  'nightflash13': 'Макс',
  'prncd ': 'Датский',
  'artemtiunov': 'Тёма',
  'leonsabr': 'Лёня',
  'katriyna': 'Катя'
};

bot.getMe()
    .then(me => {
        console.log('Bot has been successfully authorized. Name is', me.first_name);
        addTrollingMessages(bot);
        botMessagesLogger(bot);

        return questionsDatabase('./questions-database/questions-test.txt');
    })
    .then(questions => {
        console.log('Questions have been loaded, there are ', questions.length, 'questions.');

        bot.on('text', msg => {
            if (msg.from.username in jjj) {
              msg.from.jjj = jjj[msg.from.username];
            } else {
              msg.from.jjj = msg.from.first_name;
            }

            const chatId = msg.chat.id;
            let game = games[chatId];

            if (!game) {
              game = games[chatId] = {};
              game.status = 'new';
            }

            if (['new', 'stopped'].includes(game.status)) {
              if (msg.text === '/start') {
                game.status = 'inprogress';
                console.log('Game started');

                game.questionId = Math.floor(Math.random() * questions.length);
                const question = questions[game.questionId];

                bot.sendMessage(chatId, 'Понеслась!').then(() => {
                  bot.sendMessage(chatId, `«${question.question}»`);
                  console.log('Question sent', question.answer);
                });
              }
            } else if (['inprogress'].includes(game.status)) {
              if (msg.text === '/stop') {
                game.status = 'stopped';
                console.log('Game stopped');

                bot.sendMessage(chatId, `${msg.from.jjj}(((`);
                return;
              }

              const question = questions[game.questionId];

              console.log('Answer received', question.answer, msg.text);

              if (question.answer === msg.text) {
                bot.sendMessage(chatId, `Да, ${msg.from.jjj}! Ещё!`, {reply_to_message_id: msg.message_id}).then(() => {
                  game.questionId = Math.floor(Math.random() * questions.length);
                  const newQuestion = questions[game.questionId];

                  bot.sendMessage(chatId, `«${newQuestion.question}»`);
                  console.log('Question sent', question.question);
                });
              } else {
                //bot.sendMessage(chatId, 'нет :(');
              }
            }
        });
    });
