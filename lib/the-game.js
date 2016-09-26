const getUserName = require('./usernames-dictionary').getName;
const hintsGenerator = require('./hints-generator');
const messages = require('./messages');

const NEW_QUESTION_DELAY = 15000;
const MESSAGE_TYPING_DELAY = 1000;
const HINTS_DELAY = 13000;

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
    this.currentQuestionIsCompleted = null;
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

    this.send(messages.end(winners));
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
      .then(() => this.bot.sendMessage(this.chat.id, text, {
        parse_mode: 'Markdown'  
      }
    ));
  }

  replyOn(msg, text) {
    return this.bot.sendMessage(this.chat.id, text, {reply_to_message_id: msg.message_id});
  }

  nobodyIsRight(question) {
    this.currentQuestionIsCompleted = true;
    return this.send(messages.nobodyIsRight(question))
      .then(() => this.sendNewQuestionAfterDelay());
  }

  generateNextHint(answer) {
    this.currentHint = hintsGenerator.generateNextHint(this.currentHint, answer);
    return this.currentHint;
  }

  sendNextHint(question) {
    clearTimeout(this.hintsTimeout);
    this.hintsCounter++;

    if (this.hintsCounter > hintsGenerator.getHintsCount(question.answer)) {
      this.hintsCounter = 0;
      return this.nobodyIsRight(question);
    }

    this.hintsTimeout = setTimeout(() => this.sendNextHint(question), HINTS_DELAY);
    return this.send(messages.hint(this.generateNextHint(question.answer), question.question, this.hintsCounter));
  }

  runHintsSequence(question) {
    this.hintsCounter = 0;
    clearTimeout(this.hintsTimeout);

    this.hintsTimeout = setTimeout(() => this.sendNextHint(question), HINTS_DELAY);
  }

  abortHintsSequence() {
    this.currentHint = '';
    clearTimeout(this.hintsTimeout);
  }

  forceGetNextHint() {
    clearTimeout(this.hintsTimeout);
    const question = this.questions[this.questionId];

    return this.sendNextHint(question);
  }

  sendNewQuestion() {
    this.abortHintsSequence();
    this.currentQuestionIsCompleted = false;
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
    this.currentQuestionIsCompleted = true;

    return this.replyOn(msg, messages.rightAnswer(this.currentPlayer))
      .then(() => this.sendNewQuestionAfterDelay());
  }

  checkAnswer(msg) {
    if (this.currentQuestionIsCompleted) {
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
