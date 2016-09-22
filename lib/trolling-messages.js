const messages = require('./messages');
let userTrollingTimeout;

function addTrollingMessage(bot, event, message) {
  bot.on(event, msg => bot.sendMessage(msg.chat.id, message));
}

function getAny(...messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomTimeout() {
    return Math.floor(1000 * 60 * 5 * Math.random());
}

function setUpUserTrolling(bot, chatid, userName) {
    stopUserTrolling();
    console.log(`${userName} trolling has been set.`);

    function trollOnUser() {
        bot.sendMessage(chatid, messages.trollUser(userName));
        userTrollingTimeout = setTimeout(trollOnUser, getRandomTimeout());
    }

    trollOnUser();
}

function stopUserTrolling() {
    clearTimeout(userTrollingTimeout);
    console.log(`Any trolling has been stopped.`);
}

module.exports = function addTrollingMessages(bot) {
  addTrollingMessage(bot, 'new_chat_title', `Мамку свою переименуй`);
  addTrollingMessage(bot, 'new_chat_photo', `Смешной комментарий`);
  addTrollingMessage(bot, 'left_chat_participant', `^ там пидор`);
  addTrollingMessage(bot, 'new_chat_participant', `Привет, Геннадий!`);

  bot.onText(/Ген[аеуы]?/i, (msg) => {
      bot.sendMessage(msg.chat.id, messages.trollingMessages(msg.from));
  });

  bot.onText(/Гена, тролль (.+)/i, (msg, match) => setUpUserTrolling(bot, msg.chat.id, match[1]));

  bot.onText(/Гена, перестань/i, stopUserTrolling)
};
