const getUserName = require('./usernames-dictionary');
const hintsGenerator = require('./hints-generator');
const messages = require('./messages');

const NEW_QUESTION_DELAY = 5000;
const MESSAGE_TYPING_DELAY = 1000;
const HINTS_DELAY = 10000;

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

    this.questionId = null;
    this.currentQuestionIsAnswered = null;
    this.currentPlayer = null;
    this.numberOfQuestions = null;
    this.hintsTimeout = null;
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
    this.send(messages.stop(getUserName(this.currentPlayer)));
    this.finish();
    console.log('[Game stopped]');
  }

  end() {
    const winners = Object.keys(this.players).map(id => this.players[id]);
    winners.sort((a, b) => b.score > a.score);

    this.send('🎉🎊💋\n\n' + winners.map(it => `@${it.username}: ${it.score} очков`).join('\n') + '\n\n');
    this.finish();
    console.log('[Game ended]');
  }

  finish() {
    this.abortHintsSequence();
    this.status = STATUS.STOPPED;
    this.counter = 0;
    this.players = {};
    clearTimeout(this.nextQuestionTimeout);
    clearTimeout(this.typingTimeout);
    this.abortHintsSequence();
    delete this.currentPlayer;
  }

  skip() {
    if (this.status !== STATUS.INPROGRESS) {
      return;
    }
    console.log('[Question skipped]');
    return this.sendNewQuestion();
  }

  send(text) {
    return this.bot.sendChatAction(this.chat.id, 'typing')
      .then(() => new Promise((resolve) => {
        this.typingTimeout = setTimeout(resolve, MESSAGE_TYPING_DELAY);
      }))
      .then(() => this.bot.sendMessage(this.chat.id, text));
  }

  replyOn(msg, text) {
    return this.bot.sendMessage(this.chat.id, text, {reply_to_message_id: msg.message_id});
  }

  nobodyIsRight(question) {
    return this.send(messages.nobodyIsRight(question))
      .then(() => this.sendNewQuestionAfterDelay());
  }

  generateNextHint(answer) {
    this.currentHint = hintsGenerator.generateNextHint(this.currentHint, answer);
    return this.currentHint;
  }

  runHintsSequence(question) {
    this.hintsCounter = 0;
    clearTimeout(this.hintsTimeout);

    const sendHint = () => {
      this.hintsCounter++;

      if (this.hintsCounter > hintsGenerator.getHintsCount(question.answer)) {
        this.hintsCounter = 0;
        return this.nobodyIsRight(question);
      }

      this.send(messages.hint(this.generateNextHint(question.answer), this.hintsCounter));
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
    this.currentQuestionIsAnswered = false;
    this.counter++;

    if (this.counter > this.numberOfQuestions) {
      this.end();
    } else {
      this.questionId = Math.floor(Math.random() * this.questions.length);
      const question = this.questions[this.questionId];
      console.log('[Question sent]', question.question);

      return this.send(messages.question(this.counter, question.question))
        .then(() => this.runHintsSequence(question));
    }
  }

  sendNewQuestionAfterDelay() {
    this.nextQuestionTimeout = setTimeout(() => this.sendNewQuestion(), NEW_QUESTION_DELAY);
  }

  onRightAnswer(msg) {
    this.currentPlayer.score++;
    this.abortHintsSequence();
    this.currentQuestionIsAnswered = true;

    return this.replyOn(msg, messages.rightAnswer(this.currentPlayer))
      .then(() => this.sendNewQuestionAfterDelay());
  }

  checkAnswer(msg) {
    if (this.currentQuestionIsAnswered) {
      return;
    }

    const question = this.questions[this.questionId];
    console.log('[Answer received]', question.answer, msg.text);

    if ((new RegExp(question.answer, 'i')).test(msg.text)) {
      return this.onRightAnswer(msg);
    }
  }
}

Game.STATUS = STATUS;

module.exports = Game;
