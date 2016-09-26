const trolling = require('./trolling-messages');
const Game = require('./the-game');
const games = new Map();

const startCommands = ['/start', '.ыефке', 'Гена, поехали', 'Гена, заводи шарманку'];
const stopCommands = ['/stop', '.ыещз', 'Гена, надоело', 'Гена, хватит'];

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
      if (startCommands.includes(command)) {
        return game.start(10);
      }
    }

    if ([Game.STATUS.INPROGRESS].includes(game.status)) {
      if (stopCommands.includes(command)) {
        game.stop();
        return games.delete(msg.chat.id);
      }
      if (['/skip', '.ылшз'].includes(command)) {
        return game.skip();
      }
      if (['/hint', 'Подсказку!'].includes(command)) {
        return game.forceGetNextHint();
      }

      return game.checkAnswer(msg);
    }

    trolling.reactOnMessage(msg, bot);
  }
};
