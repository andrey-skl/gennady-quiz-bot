const TURN_ON_GREEN = '\033[32m';
const TURN_ON_BLUE = '\033[34m';
const RESET_COLOR = '\033[0m';

module.exports = function botMessagesLogger(bot) {
  bot.on('text', msg => {
    console.log(TURN_ON_GREEN, '[Message]', TURN_ON_BLUE, msg.chat.title || '[PM]', msg.from.username, RESET_COLOR, msg.text);
  });
};
