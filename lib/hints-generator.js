const HINT_PLACEHOLER = '•';

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
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

module.exports = {
  HINT_PLACEHOLER: HINT_PLACEHOLER,

  generateNextHint(hint, answer, hintsCount) {
    const lettersToOpen = Math.floor(answer.length / hintsCount) || 1;

    if (!hint) {
      return answer.replace(/./ig, HINT_PLACEHOLER);
    } else {
      let stillHiddenIndexes = findHiddenIndexes(hint);
      stillHiddenIndexes = shuffleArray(stillHiddenIndexes);
      stillHiddenIndexes = stillHiddenIndexes.slice(0, lettersToOpen);

      stillHiddenIndexes.forEach((hiddenIndex) => {
        hint = setCharAt(hint, hiddenIndex, answer[hiddenIndex]);
      });

      return hint;
    }
  }
};