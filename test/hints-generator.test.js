require('./chai-setup');
const hintsGenerator = require('../lib/hints-generator');

describe('Hints Generator', () => {
  const generate = hintsGenerator.generateNextHint;
  const hidden = hintsGenerator.HINT_PLACEHOLER;

  it('should generate initial hint', () => generate('', 'foo').should.equal(`${hidden}${hidden}${hidden}`));

});