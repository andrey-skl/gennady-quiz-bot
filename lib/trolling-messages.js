function addTrollingMessage(bot, event, message) {
  bot.on(event, msg => bot.sendMessage(msg.chat.id, message));
}

module.exports = function addTrollingMessages(bot) {
  addTrollingMessage(bot, 'new_chat_title', `Мамку свою переименуй`);
  addTrollingMessage(bot, 'new_chat_photo', `Смешной комментарий`);
  addTrollingMessage(bot, 'left_chat_participant', `^ там пидор`);
  addTrollingMessage(bot, 'new_chat_participant', `Привет, Геннадий!`);

  bot.on('text', msg => {
    if (/Ген[аеуы]?/i.test(msg.text)) {
      bot.sendMessage(msg.chat.id, `@${msg.from.username} :-*`);
    }
  });
};
