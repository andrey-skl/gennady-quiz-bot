const Game = require('./the-game');
const games = {};

module.exports = {
  reactOnMessage: function reactOnMessage(bot, questions, msg) {
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
        game.destroy();
        games[msg.chat.id] = null;
      } else if (['/skip', '.ылшз'].includes(msg.text)) {
        game.skip();
      } else {
        game.onAnswer(msg);
      }
    }
  }
};