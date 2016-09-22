class Game {
  constructor(bot, chat, questions) {
    this.bot = bot;
    this.chat = chat;
    this.questions = questions;

    this.status = 'new';
    this.counter = 0;
    this.players = {};
  }

  setCurrentPlayer(from) {
    this.currentPlayer = this.players[from.id] = this.players[from.id] || from;
    this.currentPlayer.score = this.currentPlayer.score || 0;
  }

  start(numberOfQuestions) {
    this.numberOfQuestions = numberOfQuestions;
    this.status = 'inprogress';
    this.send('Понеслась!').then(() => this.sendNewQuestion());
    console.log('Game started');
  }

  stop() {
    this.send(`${this.currentPlayer.jjj}(((`);
    this.finish();
    console.log('Game stopped');
  }

  end() {
    const winners = Object.keys(this.players).map(id => this.players[id]);
    //winners.filter().sort();
    this.send('🎉🎊💋\n\n' + winners.map(it => `@${it.username}: ${it.score} очков`).join('\n') + '\n\n');
    this.finish();
    console.log('Game ended');
  }

  finish() {
    this.status = 'stopped';
    this.counter = 0;
    this.players = {};
    delete this.currentPlayer;
  }

  skip() {
    this.sendNewQuestion();
    console.log('Answer skipped');
  }

  send(text) {
    return this.bot.sendMessage(this.chat.id, text);
  }

  replyOn(msg, text) {
    return this.bot.sendMessage(this.chat.id, text, {reply_to_message_id: msg.message_id});
  }

  sendNewQuestion() {
    this.counter++;

    if (this.counter > this.numberOfQuestions) {
      this.end();
    } else {
      this.questionId = Math.floor(Math.random() * this.questions.length);
      const question = this.questions[this.questionId];
      return this.send(`${this.counter}. ${question.question}`);
      console.log('Question sent', question.question);
    }
  }

  onAnswer(msg) {
    const question = this.questions[this.questionId];
    if ((new RegExp(question.answer, 'i')).test(msg.text)) {
      this.currentPlayer.score++;
      this.replyOn(msg, `Да, ${this.currentPlayer.jjj}! Ещё!`).then(() => this.sendNewQuestion());
    } else {
      //this.send(this.chat.id, 'нет :(');
    }

    console.log('Answer received', question.answer, msg.text);
  }
}

module.exports = Game;
