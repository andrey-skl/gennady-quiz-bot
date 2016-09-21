
function addTrollingMessage(bot, event, message) {
    bot.on(event, msg => bot.sendMessage(msg.chat.id, message))

}

module.exports = function addTrollingMessages(bot) {
    addTrollingMessage(bot, 'new_chat_title', `Мамку свою переименуй`);
    addTrollingMessage(bot, 'new_chat_photo', `Смешной комментарий`);
    addTrollingMessage(bot, 'left_chat_participant', `^ там пидор`);
    addTrollingMessage(bot, 'new_chat_participant', `Привет, Геннадий!`);

    bot.on('text', msg => {
        if (msg.text.indexOf('Гена') !== -1) {
            bot.sendMessage(msg.chat.id, `Отстань от меня, ${msg.from.first_name}!!`);
        }
    });
};