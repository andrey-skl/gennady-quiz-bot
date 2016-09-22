require('./chai-setup');
const sinon = require('sinon');

const Game = require('../lib/the-game');

const HINTS_DELAY = 10000;
const NEW_QUESTION_DELAY = 5000;

describe('The Game', () => {
  let fakeBot;
  let fakeQuestions = [{question: 'foo', answer: 'bar'}];
  let fakeChat = {
    id: 'fake-chag-id'
  };
  let clock;

  const createGame = () => (new Game(fakeBot, fakeChat, fakeQuestions));

  beforeEach(() => {
    fakeBot = {
      sendMessage: sinon.stub().returns(Promise.resolve())
    };
    this.sinon = sinon.sandbox.create();
    clock = this.sinon.useFakeTimers();
  });

  it('should include', () => Game.should.be.defined);

  it('should create instance', () => createGame().should.be.defined);

  it('should start the game', () => {
    const game = createGame();

    game.start(3);

    game.numberOfQuestions.should.equal(3);
    game.status.should.equal(Game.STATUS.INPROGRESS);
    fakeBot.sendMessage.should.have.been.called;
  });

  it('should send question', () => {
    const game = createGame();
    game.start(3);
    game.sendNewQuestion();

    fakeBot.sendMessage.should.have.been.calledWith(fakeChat.id, '1. foo');
  });

  it('should send question after delay', () => {
    const game = createGame();
    this.sinon.stub(game, 'sendNewQuestion');
    game.sendNewQuestionAfterDelay();
    clock.tick(NEW_QUESTION_DELAY);

    game.sendNewQuestion.should.have.been.called;
  });

  it('should generate the first ****-like hint', () => {
    const game = createGame();

    game.runHintsSequence(fakeQuestions[0]);

    game.currentHint.should.equal('');

    clock.tick(HINTS_DELAY + 1000);

    game.currentHint.should.equal('•••');
    fakeBot.sendMessage.should.have.been.calledWith(fakeChat.id, 'Подсказка: •••');
  });
});