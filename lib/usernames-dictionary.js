const dictionary = {
    'huston007': 'Андрей',
    'vomixamxam': 'Макс',
    'nightflash13': 'Максимчик',
    'karinagaripova': 'Карина',
    'prncd': 'Женя',
    'artemtiunov': 'Тёма',
    'leonsabr': 'Лёня',
    'katriyna': 'Катя',
    'thegirl ': 'Натусик',
    'vandrianova ': 'Лера',
    'slowspock': 'Настя'
};

module.exports = function getName({username, first_name, last_name}) {
  return dictionary[username] ||
    first_name && last_name && `${first_name} ${last_name}` ||
    first_name ||
    last_name ||
    username;
};
