function addTrollingMessage(bot, event, message) {
  bot.on(event, msg => bot.sendMessage(msg.chat.id, message));
}

function getAny(...messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

function getRandomTimeout() {
    return Math.floor(1000 * 60 * 5 * Math.random());
}

function setUpDatskyTrolling(bot, chatid) {
    console.log('Datsky trolling has been set.');

    function trollOnDatsky() {
        bot.sendMessage(chatid, getAny(
            `@prncd Как дела?`,
            `@prncd Чего делаешь?`,
            `@prncd Почему ты не дома?`,
            `@prncd How are brand new ring-ui components doing?`,
            `@prncd Нам нужно поговорить.`
        ));
        setTimeout(trollOnDatsky, getRandomTimeout());
    }

    setTimeout(trollOnDatsky, getRandomTimeout());
}

module.exports = function addTrollingMessages(bot) {
  addTrollingMessage(bot, 'new_chat_title', `Мамку свою переименуй`);
  addTrollingMessage(bot, 'new_chat_photo', `Смешной комментарий`);
  addTrollingMessage(bot, 'left_chat_participant', `^ там пидор`);
  addTrollingMessage(bot, 'new_chat_participant', `Привет, Геннадий!`);

  bot.onText(/Ген[аеуы]?/i, (msg) => {
      bot.sendMessage(msg.chat.id, getAny(
          `@${msg.from.username} :-*`,
          `${msg.from.first_name}, а ты не пидор случайно?`,
          `${msg.from.first_name}, отстань`,
          `${msg.from.first_name}, дома поговорим.`,
          `${msg.from.first_name}, ты до всех так докапываешься?`,
          `${msg.from.first_name}, один парень тоже так говорил. И где он теперь?`,
          `@${msg.from.username}, а твоя мамка знает, что ты не в школе?`
      ));
  });

  bot.onText(/датский/i, msg => setUpDatskyTrolling(bot, msg.chat.id))
};
