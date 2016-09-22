
function getAny(...messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = {
  startGame: () => getAny(
    'Понеслась!',
    'Крутись, барабан!',
    'А ты смелый!',
    'Ну давай, давай.'
  ),
  trollUser: (userName) => getAny(
    `${userName} Как дела?`,
    `${userName} Чего делаешь?`,
    `${userName} Почему ты не дома?`,
    `${userName} Нам нужно поговорить.`
  ),
  trollingMessages: (user) => getAny(
    `@${user.username} :-*`,
    `${user.first_name}, а ты не пидор случайно?`,
    `${user.first_name}, отстань`,
    `${user.first_name}, дома поговорим.`,
    `${user.first_name}, ты до всех так докапываешься?`,
    `${user.first_name}, один парень тоже так говорил. И где он теперь?`,
    `@${user.username}, а твоя мамка знает, что ты не в школе?`
  ),
  nobodyIsRight: (question) => getAny(
    `Ну вы даёте, "${question.answer}" же! 😓`,
    `Никто не смог. "${question.answer}" - правильный ответ.😿`,
    `Мне за вас стыдно. Погуглите "${question.answer}" немедленно.`,
    `Вы вообще в школе учились? Ответ: ${question.answer}`,
    `Серьёзно, не знаете что это "${question.answer}"? 🙀`
  ),
  rightAnswer: (userName) => getAny(
    `Да, ${userName}! Ещё!`,
    `${userName} ответил как Боженька!`,
    `Учитесь как надо!`,
    `Вот он, ответ моей мечты!`,
    `Садись, ${userName}, пять!`,
    `Люблю такое.`,
    `В кого ты такой умный, ${userName}?`,
    `Много будешь знать - скоро состаришься.`,
    `Аймалаца!`
  )
};