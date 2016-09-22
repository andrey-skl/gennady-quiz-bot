const TelegramBot = require('node-telegram-bot-api');
const questionsDatabase = require('./lib/questions-database');
const addTrollingMessages = require('./lib/trolling-messages');
const botMessagesLogger = require('./lib/bot-messages-logger');
const Game = require('./lib/the-game');

const isDev = process.argv.indexOf('--prod') === -1;
const config = isDev ? require('./config-dev.json') : require('./config-prod.json');

const games = {};

//NOTE: You should get this file from one of our team
const BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

console.log('Authorizing and initializing Gennady...');

bot.getMe()
  .then(me => {
    console.log('Bot has been successfully authorized. Name is', me.first_name);
    addTrollingMessages(bot);
    botMessagesLogger(bot);

    return questionsDatabase(config.database);
  })
  .then(questions => {
    console.log('Questions have been loaded, there are ', questions.length, 'questions.');

    bot.on('text', msg => {
      let game = games[msg.chat.id];
      if (!game) {
        game = games[msg.chat.id] = new Game(bot, msg.chat, questions);
      }

      game.setCurrentPlayer(msg.from);

      if ([Game.STATUS.NEW, Game.STATUS.STOPPED].includes(game.status)) {
        if (['/start', '.ыефке'].includes(msg.text)) {
          game.start(10);
        }
      } else if ([Game.STATUS.INPROGRESS].includes(game.status)) {
        if (['/stop', '.ыещз'].includes(msg.text)) {
          game.stop();
        } else if (['/skip', '.ылшз'].includes(msg.text)) {
          game.skip();
        } else {
          game.onAnswer(msg);
        }
      }
    });
  });
