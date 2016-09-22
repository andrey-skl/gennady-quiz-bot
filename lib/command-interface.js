const Game = require('./the-game');
const games = new Map();

function getOrCreateGame(bot, chat, questions) {
  if (games.has(chat.id)) {
    return games.get(chat.id);
  }
  const game = new Game(bot, chat, questions);
  games.set(chat.id, game);
  return game;
}

module.exports = {
  reactOnMessage: function reactOnMessage(bot, questions, msg) {
    let game = getOrCreateGame(bot, msg.chat, questions);
    game.setCurrentPlayer(msg.from);

    const command = msg.text.replace(/@GennadyQuizBot$/, '');

    if ([Game.STATUS.NEW, Game.STATUS.STOPPED].includes(game.status)) {
      if (['/start', '.ыефке'].includes(command)) {
        game.start(10);
      }
    } else if ([Game.STATUS.INPROGRESS].includes(game.status)) {
      if (['/stop', '.ыещз'].includes(command)) {
        game.stop();
        games.delete(msg.chat.id);
      } else if (['/skip', '.ылшз'].includes(command)) {
        game.skip();
      } else {
        game.onAnswer(msg);
      }
    }
  }
};
