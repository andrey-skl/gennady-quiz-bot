require('./chai-setup');
const sinon = require('sinon');
const hintsGenerator = require('../lib/hints-generator');

describe('Hints Generator', function() {
  const generate = hintsGenerator.generateNextHint;
  const getHintsCount = hintsGenerator.getHintsCount;
  const hidden = hintsGenerator.HINT_PLACEHOLER;
  const fiveLettersEmptyHint = `${hidden}${hidden}${hidden}${hidden}${hidden}`;
  const answer = 'ooooo';
  const hintsCount = 5;

  beforeEach(() => {
    this.sinon = sinon.sandbox.create();
  });

  afterEach(() => this.sinon.restore());

  const countChars = (string, char) => (string.split(char).length - 1);

  it('should generate initial hint', () => generate('', answer, hintsCount).should.equal(fiveLettersEmptyHint));

  it('should open exactly 1 letter for second hint', () => {
    const hint = generate(fiveLettersEmptyHint, answer, hintsCount);
    countChars(hint, 'o').should.equal(1);
  });

  it('should open exactly 2 letter for third hint', () => {
    const firstHint = generate(fiveLettersEmptyHint, answer, hintsCount);
    const hint = generate(firstHint, answer, hintsCount);
    countChars(hint, 'o').should.equal(2);
  });

  it('should open spaces in hint immidiatelly', () => {
    const firstHint = generate(``, 'o o', 3);
    firstHint.should.equal(`${hidden} ${hidden}`);
  });

  it('should open exactly 4 letter for third hint', () => {
    const firstHint = generate(fiveLettersEmptyHint, answer, hintsCount);
    const secondHint = generate(firstHint, answer, hintsCount);
    const thirdHint = generate(secondHint, answer, hintsCount);
    const fourhHint = generate(thirdHint, answer, hintsCount);
    countChars(fourhHint, 'o').should.equal(4);
  });

  it('should open exactly 2 letter in first hint of 10-letter word', () => {
    const firstHint = generate(fiveLettersEmptyHint + fiveLettersEmptyHint, answer + answer, hintsCount);
    countChars(firstHint, 'o').should.equal(2);
  });
});