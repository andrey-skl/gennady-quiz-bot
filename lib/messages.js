const getUserName = require('./usernames-dictionary');

function getAny(...messages) {
  return messages[Math.floor(Math.random() * messages.length)];
}

const START_EMOJI = '🚜';
const WRONG_EMOJI = '🙈';
const RIGHT_EMOJI = '🍭';
const STOP_EMOJI = '💔';
const QUESTION_EMOJI = '❓';
const BANK_EMOJI = '🏦';
const HINT_EMOJIS = ['🕛', '🕒', '🕧', '🕘'];
const PLACE_EMOJIS = {pile: '💰', pound: '💷', euro: '💶', buck: '💵', yen: '💴', fly: '💸'};

function getPlaceEmoji(place) {
  switch (place) {
    case 0:
      return PLACE_EMOJIS.pile;
    case 1:
    case 2:
      return PLACE_EMOJIS.pound;
    case 3:
    case 4:
      return PLACE_EMOJIS.euro;
    case 5:
    case 6:
      return PLACE_EMOJIS.buck;
    case 7:
    case 8:
    case 9:
    case 10:
      return PLACE_EMOJIS.yen;
    default:
      return PLACE_EMOJIS.fly;
  }
}

module.exports = {
  startGame: () => `${START_EMOJI} ${getAny(
    'Понеслась!',
    'Крутись, барабан!',
    'А ты смелый!',
    'Ну давай, давай!'
  )}`,
  hint: (hint, question, number) => `${QUESTION_EMOJI}${question}\n\n${HINT_EMOJIS[number - 1] || ''} Подсказка: ${hint}`,
  question: (counter, question) => `${QUESTION_EMOJI} ${counter}. ${question}`,
  stop: player => `${STOP_EMOJI} ${player}, не говори так(((`,
  // Add places instead of score 
  end: winners => `${BANK_EMOJI} *А вот и миллионеры:* 

${winners.map((it, place) => `${getPlaceEmoji(place)} *${getUserName(it)}*  очков(а): ${it.score}, ответов: ${it.score}`).join('\n')}

`,
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
  nobodyIsRight: (question) => `${WRONG_EMOJI}️ ${getAny(
    `Ну вы даёте, *${question.answer}* же! 😓`,
    `Никто не смог. *${question.answer}* - правильный ответ.😿`,
    `Мне за вас стыдно. Погуглите *${question.answer}* немедленно.`,
    `Вы вообще в школе учились? Ответ: *${question.answer}*`,
    `Серьёзно, не знаете что это *${question.answer}*?`
  )}`,
  rightAnswer: (user) => {
    const userName = getUserName(user);

    return `${RIGHT_EMOJI} ${getAny(
      `Да, ${userName}! Ещё!`,
      `${userName} ответил как Боженька!`,
      `Учитесь, как надо!`,
      `Вот он, ответ моей мечты!`,
      `Садись, ${userName}, пять!`,
      `Люблю такое.`,
      `В кого ты такой умный, ${userName}?`,
      `Много будешь знать — скоро состаришься.`,
      `Аймалаца!`
    )}`
  }
};