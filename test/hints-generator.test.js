require('./chai-setup');
const sinon = require('sinon');
const hintsGenerator = require('../lib/hints-generator');

describe('Hints Generator', function() {
  const generate = hintsGenerator.generateNextHint;
  const hidden = hintsGenerator.HINT_PLACEHOLER;
  const fiveLettersEmptyHint = `${hidden}${hidden}${hidden}${hidden}${hidden}`;

  let sandbox;

  beforeEach(() => {
    this.sinon = sinon.sandbox.create();
  });

  afterEach(() => this.sinon.restore());

  it('should generate initial hint', () => generate('', 'foooo').should.equal(fiveLettersEmptyHint));

  it('should open at least 1 letter for second hint', () => {
    generate(fiveLettersEmptyHint, 'ooooo').should.contain('o');
  });
});