const HINT_PLACEHOLER = '•';

module.exports = {
  HINT_PLACEHOLER: HINT_PLACEHOLER,

  generateNextHint(currentHint, answer) {
    if (!currentHint) {
      return answer.replace(/./ig, HINT_PLACEHOLER);
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
      return letters.join('');
    }
  }
};