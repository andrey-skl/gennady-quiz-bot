const HINT_PLACEHOLER = '•';
const MAX_HINTS = 4;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function setCharAt(str, index, char) {
  if (index > str.length - 1) {
    return str;
  }
  return str.substr(0, index) + char + str.substr(index + 1);
}

function findHiddenIndexes(hint) {
  return hint.split('')
    .reduce((indexes, char, index) => {
      if (char === HINT_PLACEHOLER) {
        return indexes.concat(index);
      }
      return indexes;
    }, []);
}

function getHintsCount(answer) {
  return answer.length > MAX_HINTS ? MAX_HINTS : answer.length;
}

module.exports = {
  HINT_PLACEHOLER,
  getHintsCount,
  
  generateNextHint(hint, answer) {
    const hintsCount = getHintsCount(answer);
    const lettersToOpen = Math.floor(answer.length / hintsCount) || 1;

    if (!hint) {
      return answer.replace(/./ig, HINT_PLACEHOLER);
    } else {
      let stillHiddenIndexes = findHiddenIndexes(hint);

      if (stillHiddenIndexes.length === 1) {
        return hint;
      }

      stillHiddenIndexes = shuffleArray(stillHiddenIndexes);
      stillHiddenIndexes = stillHiddenIndexes.slice(0, lettersToOpen);

      stillHiddenIndexes.forEach((hiddenIndex) => {
        hint = setCharAt(hint, hiddenIndex, answer[hiddenIndex]);
      });

      return hint;
    }
  }
};