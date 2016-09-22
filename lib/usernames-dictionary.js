const dictionary = {
    'huston007': 'Андрей',
    'vomixamxam': 'Макс',
    'nightflash13': 'Макс',
    'prncd ': 'Женя',
    'artemtiunov': 'Тёма',
    'leonsabr': 'Лёня',
    'katriyna': 'Катя',
    'thegirl ': 'Натусик',
    'vandrianova ': 'Лера'
};

module.exports = function getName(user) {
    return dictionary[user.username] || user.first_name;
};