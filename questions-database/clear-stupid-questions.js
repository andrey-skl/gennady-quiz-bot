const natural = require('natural');
const csv = require('fast-csv');
const fs = require('fs');
const db = require('../lib/questions-database');

const path = './questions-database/questions_3.txt';
const JARO_WINKLER_MAX = 0.7;
const MIN_QUESTION_LENGTH = 20;

const csvStream = csv.createWriteStream({delimiter: '|'});
const writableStream = fs.createWriteStream('./questions-database/tmp_out.txt');

writableStream.on('finish', () => console.log('Clearing done'));

csvStream.pipe(writableStream);

function isAcceptableQuestion(question) {
  const coef = natural.JaroWinklerDistance(question.question, question.answer);

  if (coef > JARO_WINKLER_MAX) {
    // console.log('Question too similar with answer:', coef, question.question, '|', question.answer);
    return false;
  }

  if (question.question.length < MIN_QUESTION_LENGTH) {
    // console.log('Question too short', question.question);
    return false;
  }

  return true;
}

db(path)
  .then(questions => {
    const filtered = questions.filter(isAcceptableQuestion);

    filtered.forEach(q => csvStream.write([q.question, q.answer]));

    console.log(questions.length - filtered.length, 'questions has been removed,', filtered.length, 'remains.');

    csvStream.end();
  });