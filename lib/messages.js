const getUserName = require('./usernames-dictionary');

function getAny(...messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = {
  startGame: () => getAny(
    'Понеслась!',
    'Крутись, барабан!',
    'А ты смелый!',
    'Ну давай, давай!'
  ),
  trollUser: (userName) => getAny(
    `${userName} Как дела?`,
    `${userName} Чего делаешь?`,
    `${userName} Почему ты не дома?`,
    `${userName} Нам нужно поговорить.`
  ),
  trollingMessages: (user) => {
    const login = user.username;
    const userName = getUserName(user);

    return getAny(
      `@${login} :-*`,
      `${userName}, а ты не пидор случайно?`,
      `${userName}, отстань`,
      `${userName}, дома поговорим.`,
      `${userName}, ты до всех так докапываешься?`,
      `${userName}, один парень тоже так говорил. И где он теперь?`,
      `@${login}, а твоя мамка знает, что ты не в школе?`
    )
  },
  nobodyIsRight: (question) => getAny(
    `Ну вы даёте, «${question.answer}» же! 😓`,
    `Никто не смог. «${question.answer}» - правильный ответ.😿`,
    `Мне за вас стыдно. Погуглите «${question.answer}» немедленно.`,
    `Вы вообще в школе учились? Ответ: ${question.answer}`,
    `Серьёзно, не знаете что это «${question.answer}»? 🙀`
  ),
  rightAnswer: (user) => {
    const userName = getUserName(user);

    return getAny(
      `Да, ${userName}! Ещё!`,
      `${userName} ответил как Боженька!`,
      `Учитесь, как надо!`,
      `Вот он, ответ моей мечты!`,
      `Садись, ${userName}, пять!`,
      `Люблю такое.`,
      `В кого ты такой умный, ${userName}?`,
      `Много будешь знать — скоро состаришься.`,
      `Аймалаца!`
    )
  }
};