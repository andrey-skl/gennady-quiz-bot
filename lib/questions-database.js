const fs = require('fs');
const csv = require('fast-csv');

module.exports = function databaseReader(path) {
  const stream = fs.createReadStream(path);

  return new Promise((resolve, reject) => {
    const results = [];

    stream.pipe(csv({delimiter: '|'})
      .on('data', ([question, answer]) => results.push({question, answer}))
      .on('end', () => resolve(results))
      .on('error', reject));
  });
};
