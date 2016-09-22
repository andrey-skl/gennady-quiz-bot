class Game {
  constructor(bot, chat, questions) {
    this.bot = bot;
    this.chat = chat;
    this.questions = questions;
    this.status = 'new';
  }

  start(from) {
    this.status = 'inprogress';
    this.send('Понеслась!').then(() => this.sendNewQuestion());
    console.log('Game started');
  }

  stop(from) {
    this.status = 'stopped';
    this.send(`${from.jjj}(((`);
    console.log('Game stopped');
  }

  send(text) {
    return this.bot.sendMessage(this.chat.id, text);
  }

  replyOn(msg, text) {
    return this.bot.sendMessage(this.chat.id, text, {reply_to_message_id: msg.message_id});
  }

  sendNewQuestion() {
    this.questionId = Math.floor(Math.random() * this.questions.length);
    const question = this.questions[this.questionId];
    return this.send(`«${question.question.slice(0, -1)}».`);
    console.log('Question sent', question.question);
  }

  onAnswer(msg) {
    const question = this.questions[this.questionId];

    if ((new RegExp(question.answer, 'i')).test(msg.text)) {
      this.replyOn(msg, `Да, ${msg.from.jjj}! Ещё!`).then(() => this.sendNewQuestion());
    } else {
      //this.send(this.chat.id, 'нет :(');
    }

    console.log('Answer received', question.answer, msg.text);
  }
}

module.exports = Game;