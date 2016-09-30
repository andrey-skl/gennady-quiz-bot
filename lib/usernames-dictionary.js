const dictionary = {
  'huston007': {name: 'Андрей', gender: 'male'},
  'cyberskunk': {name: 'Игорь', gender: 'male'},
  'vomixamxam': {name: 'Макс', gender: 'male'},
  'nightflash13': {name: 'Максимчик', gender: 'male'},
  'karinagaripova': {name: 'Карина', gender: 'female'},
  'prncd': {name: 'Женя', gender: 'male'},
  'artemtiunov': {name: 'Тёма', gender: 'male'},
  'leonsabr': {name: 'Лёня', gender: 'male'},
  'katriyna': {name: 'Катя', gender: 'female'},
  'kashelkin': {name: 'Слава', gender: 'male'},
  'thegirl': {name: 'Натусик', gender: 'female'},
  'vandrianova': {name: 'Лера', gender: 'female'},
  'slowspock': {name: 'Настя', gender: 'female'}
};

function getName({username, first_name, last_name}) {
  const fromDictionary = dictionary[username] && dictionary[username].name;

  return fromDictionary ||
    first_name ||
    last_name ||
    username;
}

function getGender({username}) {
  if (dictionary[username]) {
    return dictionary[username].gender;
  }
  return 'male';
}

module.exports = {
  getName,
  getGender
};