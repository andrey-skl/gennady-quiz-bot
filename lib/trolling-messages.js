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

function setUpUserTrolling(bot, chatid, login) {
    console.log(`${login} trolling has been set.`);

    function trollOnUser() {
        bot.sendMessage(chatid, getAny(
            `@${login} Как дела?`,
            `@${login} Чего делаешь?`,
            `@${login} Почему ты не дома?`,
            `@${login} Нам нужно поговорить.`
        ));
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

  bot.onText(/Гена, тролль (.+)/i, (msg, username) => setUpUserTrolling(bot, msg.chat.id, username));

  bot.onText(/Гена, перестань/i, stopUserTrolling)
};
