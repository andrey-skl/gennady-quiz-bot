const Game = require('./the-game');
const gamesMap = new Map();

function getOrCreateGame(bot, chat, questions) {
  if (gamesMap.has(chat.id)) {
    return gamesMap.get(chat.id);
  }
  const game = new Game(bot, chat, questions);
  gamesMap.set(chat.id, game);
  return game;
}

module.exports = {
  reactOnMessage: function reactOnMessage(bot, questions, msg) {
    let game = getOrCreateGame(bot, msg.chat, questions);
    game.setCurrentPlayer(msg.from);

    if ([Game.STATUS.NEW, Game.STATUS.STOPPED].includes(game.status)) {
      if (['/start', '.ыефке'].includes(msg.text)) {
        game.start(10);
      }
    } else if ([Game.STATUS.INPROGRESS].includes(game.status)) {
      if (['/stop', '.ыещз'].includes(msg.text)) {
        game.stop();
        gamesMap.delete(msg.chat.id);
      } else if (['/skip', '.ылшз'].includes(msg.text)) {
        game.skip();
      } else {
        game.onAnswer(msg);
      }
    }
  }
};