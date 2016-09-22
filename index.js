const TelegramBot = require('node-telegram-bot-api');
const questionsDatabase = require('./lib/questions-database');
const addTrollingMessages = require('./lib/trolling-messages');
const botMessagesLogger = require('./lib/bot-messages-logger');
const Game = require('./lib/Game');

const games = {};

const jjj = {
  'huston007': 'Андрей',
  'vomixamxam': 'Макс',
  'nightflash13': 'Макс',
  'prncd ': 'Датский',
  'artemtiunov': 'Тёма',
  'leonsabr': 'Лёня',
  'katriyna': 'Катя',
  'thegirl ': 'Натусик',
  'vandrianova ': 'Лера'
};

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
    console.log('Questions have been loaded, there are ', questions.length, 'questions.');

    bot.on('text', msg => {
      if (msg.from.username in jjj) {
        msg.from.jjj = jjj[msg.from.username];
      } else {
        msg.from.jjj = msg.from.first_name;
      }

      let game = games[msg.chat.id];

      if (!game) {
        game = games[msg.chat.id] = new Game(bot, msg.chat, questions);
      }

      if (['new', 'stopped'].includes(game.status)) {
        if (msg.text === '/start') {
          game.start(msg.from);
        }
      } else if (['inprogress'].includes(game.status)) {
        if (msg.text === '/stop') {
          game.stop(msg.from);
        } else {
          game.onAnswer(msg);
        }
      }
    });
  });
