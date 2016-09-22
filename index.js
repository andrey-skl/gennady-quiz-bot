const TelegramBot = require('node-telegram-bot-api');
const questionsDatabase = require('./lib/questions-database');
const addTrollingMessages = require('./lib/trolling-messages');
const botMessagesLogger = require('./lib/bot-messages-logger');
const commandInterface = require('./lib/command-interface');

const isDev = process.argv.indexOf('--prod') === -1;
const config = isDev ? require('./config-dev.json') : require('./config-prod.json');

//NOTE: You should get this file from one of our team
const BOT_API_TOKEN = require('./BOT_API_KEY.json').key;

const bot = new TelegramBot(BOT_API_TOKEN, {polling: true});

console.log('Authorizing and initializing Gennady...');

bot.getMe()
  .then(me => {
    console.log('Bot has been successfully authorized. Name is', me.first_name);
    addTrollingMessages(bot);
    botMessagesLogger(bot);

    return Promise.all(config.databases.map(path => questionsDatabase(require.resolve(path))))
      .then((parts) => [].concat.apply([], parts))
  })
  .then(questions => {
    console.log('Questions have been loaded, there are ', questions.length, 'questions.');

    bot.on('text', msg => commandInterface.reactOnMessage(bot, questions, msg));
  });
