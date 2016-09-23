const fs = require('fs');
const path = require('path');
const messages = require('./messages');
let userTrollingTimeout;

function addTrollingMessage(bot, event, message) {
  bot.on(event, msg => bot.sendMessage(msg.chat.id, message));
}

function getRandomTimeout() {
  return Math.floor(1000 * 60 * 5 * Math.random());
}

function setUpUserTrolling(bot, chatid, userName) {
  stopUserTrolling(bot, chatid);
  console.log(`${userName} trolling has been set.`);

  function trollOnUser() {
    bot.sendMessage(chatid, messages.trollUser(userName));
    userTrollingTimeout = setTimeout(trollOnUser, getRandomTimeout());
  }

  trollOnUser();
}

function stopUserTrolling(bot, chatId) {
  clearTimeout(userTrollingTimeout);
  bot.sendMessage(chatId, `Хорошо, я больше не буду.`);
  console.log(`Any trolling has been stopped.`);
}

function sendRandomSticker(bot, chatId) {
  return new Promise((resolve) => {
    fs.readdir(path.resolve(__dirname, '../stickers/'), (err, files) => resolve(files));
  })
    .then(files => {
      const randomStickerFile = files[Math.floor(Math.random() * files.length)];
      return bot.sendSticker(chatId, path.resolve(__dirname, '../stickers/', randomStickerFile));
    });
}

module.exports = function addTrollingMessages(bot) {
  addTrollingMessage(bot, 'new_chat_title', `Мамку свою переименуй`);
  addTrollingMessage(bot, 'new_chat_photo', `Смешной комментарий`);
  addTrollingMessage(bot, 'left_chat_participant', `^ там пидор`);
  addTrollingMessage(bot, 'new_chat_participant', `Привет, Геннадий!`);

  bot.on('message', (msg) => {
    if (msg.sticker && ['huston007', 'vomixamxam', 'prncd'].includes(msg.from.username)) {
      console.log('[Sending sticker]');
      bot.sendChatAction(msg.chat.id, 'upload_photo');
      setTimeout(() => sendRandomSticker(bot, msg.chat.id), 1000);
    }
  });

  bot.onText(/Ген[аеуы]?/i, (msg) => {
    bot.sendChatAction(msg.chat.id, 'typing');
    setTimeout(() => bot.sendMessage(msg.chat.id, messages.trollingMessages(msg.from)), 1000);
  });

  bot.onText(/Гена, тролль (.+)/i, (msg, match) => setUpUserTrolling(bot, msg.chat.id, match[1]));

  bot.onText(/Гена, перестань/i, (msg) => stopUserTrolling(bot, msg.chat.id))
};
