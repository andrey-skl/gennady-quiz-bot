const getUserName = require('./usernames-dictionary');
const messages = require('./messages');

const NEW_QUESTION_DELAY = 5000;
const HINTS_DELAY = 10000;
const MAX_HINTS = 4;
const HINT_PLACEHOLER = '•';

const STATUS = {
  NEW: 'STATUS_NEW',
  INPROGRESS: 'STATUS_INPROGRESS',
  STOPPED: 'STATUS_STOPPED'
};

class Game {
  constructor(bot, chat, questions) {
    this.bot = bot;
    this.chat = chat;
    this.questions = questions;

    this.status = STATUS.NEW;
    this.counter = 0;
    this.players = {};

    this.hintsCounter = 0;
    this.currentHint = '';
  }

  setCurrentPlayer(from) {
    this.currentPlayer = this.players[from.id] = this.players[from.id] || from;
    this.currentPlayer.score = this.currentPlayer.score || 0;
  }

  start(numberOfQuestions) {
    this.numberOfQuestions = numberOfQuestions;
    this.status = STATUS.INPROGRESS;
    this.send(messages.startGame())
      .then(() => this.sendNewQuestion());
    console.log('[Game started]');
  }

  stop() {
    this.send(`${getUserName(this.currentPlayer)}, не говори так(((`);
    this.finish();
    console.log('[Game stopped]');
  }

  end() {
    const winners = Object.keys(this.players).map(id => this.players[id]);
    //winners.filter().sort();
    this.send('🎉🎊💋\n\n' + winners.map(it => `@${it.username}: ${it.score} очков`).join('\n') + '\n\n');
    this.finish();
    console.log('[Game ended]');
  }

  finish() {
    this.abortHintsSequence();
    this.status = STATUS.STOPPED;
    this.counter = 0;
    this.players = {};
    delete this.currentPlayer;
  }

  skip() {
    this.sendNewQuestion();
    console.log('[Answer skipped]');
  }

  send(text) {
    return this.bot.sendMessage(this.chat.id, text);
  }

  replyOn(msg, text) {
    return this.bot.sendMessage(this.chat.id, text, {reply_to_message_id: msg.message_id});
  }

  nobodyIsRight() {
    const question = this.questions[this.questionId];

    return this.send(messages.nobodyIsRight(question))
      .then(() => this.sendNewQuestionAfterDelay());
  }

  generateBetterHint(answer) {
    if (!this.currentHint) {
      this.currentHint = answer.replace(/./ig, HINT_PLACEHOLER);
    } else {
      const letters = [];
      for (let letterIndex = 0; letterIndex < this.currentHint.length; letterIndex++) {
        const currentHintLetter = this.currentHint[letterIndex];

        letters.push(
          (currentHintLetter === HINT_PLACEHOLER && Math.random() < 0.2) ?
            answer[letterIndex] :
            currentHintLetter
        );
      }
      this.currentHint = letters.join('');
    }

    return this.currentHint;
  }

  runHintsSequence(question) {
    this.hintsCounter = 0;
    clearTimeout(this.hintsTimeout);

    const sendHint = () => {
      this.hintsCounter++;

      if (this.hintsCounter > MAX_HINTS) {
        this.hintsCounter = 0;
        return this.nobodyIsRight();
      }

      this.send(`Подсказка: ${this.generateBetterHint(question.answer)}`);
      this.hintsTimeout = setTimeout(sendHint, HINTS_DELAY);
    };

    this.hintsTimeout = setTimeout(sendHint, HINTS_DELAY);
  }

  abortHintsSequence() {
    this.currentHint = '';
    clearTimeout(this.hintsTimeout);
  }

  sendNewQuestion() {
    this.abortHintsSequence();
    this.counter++;

    if (this.counter > this.numberOfQuestions) {
      this.end();
    } else {
      this.questionId = Math.floor(Math.random() * this.questions.length);
      const question = this.questions[this.questionId];
      console.log('[Question sent]', question.question);

      return this.send(`${this.counter}. ${question.question}`)
        .then(() => this.runHintsSequence(question));
    }
  }

  sendNewQuestionAfterDelay() {
    setTimeout(() => this.sendNewQuestion(), NEW_QUESTION_DELAY);
  }

  onAnswer(msg) {
    const question = this.questions[this.questionId];
    if ((new RegExp(question.answer, 'i')).test(msg.text)) {
      this.currentPlayer.score++;
      this.abortHintsSequence();
      const userName = getUserName(this.currentPlayer);

      this.replyOn(msg, messages.rightAnswer(userName))
          .then(() => setTimeout(() => this.sendNewQuestionAfterDelay()));
    }

    console.log('[Answer received]', question.answer, msg.text);
  }
}

Game.STATUS = STATUS;

module.exports = Game;
