export function parseArguments(args) {
  const dictionary = {};
  let defaultLanguage = '';

  if (typeof args[0] === 'string') {
    // here we have string + data
    const [ language, data ] = args;
    defaultLanguage = language;
    dictionary[language] = data;
  } else {
    const list = Array.isArray(args[0]) ? args[0] : args;
    // here we have list of { language, data } objects
    list.forEach(({ language, data }) => {
      if (data && language) {
        if (!defaultLanguage) defaultLanguage = language;
        dictionary[language] = data;
      }
    });
  }

  return [ dictionary, defaultLanguage ];
}

export function i18n({ defaultLanguage, language, startSeparator, endSeparator, warning }) {
  let dictionary = {};
  let dictDefaultLanguage = defaultLanguage || '';
  let dictLanguage = '';
  let dictResideLanguage = '';

  const dictStartSeparator = startSeparator || '{';
  const dictEndSeparator = endSeparator || '}';
  const dictWarning = warning;

  const i18n = {
    add() {
      const [ newDictionary, newDefaultLanguage ] = parseArguments(Array.prototype.slice.call(arguments));
      if (!defaultLanguage) dictDefaultLanguage = newDefaultLanguage;
      dictionary = Object.assign({}, dictionary, newDictionary);
    },

    useDefaultLanguage(lang) {
      if (lang && typeof lang === 'string') dictDefaultLanguage = lang;
    },

    useLanguage(lang) {
      dictLanguage = lang;
      dictResideLanguage = lang.slice(0, 2);
    },

    getLanguage() {
      return dictLanguage;
    },

    getResideLanguage() {
      return dictResideLanguage;
    },

    getDictionary() {
      return dictionary;
    },

    _selectPhrase(phrase) {
      function selectPhraseFromDict(lang, phrase) {
        const dictionaryInstance = dictionary[lang];
        return dictionaryInstance ? dictionaryInstance[phrase] : '';
      }

      return selectPhraseFromDict(dictLanguage, phrase)
        || selectPhraseFromDict(dictResideLanguage, phrase)
        || selectPhraseFromDict(dictDefaultLanguage, phrase);
    },

    translate(phrase = '') {
      if (!phrase) return '';

      let result = i18n._selectPhrase(phrase);
      const args = Array.prototype.slice.call(arguments, 1);

      const wildCardRegex = new RegExp(`${dictStartSeparator}.+?${dictEndSeparator}`, 'g');

      const wildcards = phrase.match(wildCardRegex);
      const replaceHash = {};

      if (wildcards) {
        wildcards.forEach((wildcard, i) => {
          replaceHash[wildcard] = args[i];
        });
      }

      if (!result) {
        const errorMessage = `error during translation with following parameters:
          phrase – ${phrase}, dictLanguage – ${dictLanguage}`;
        if (dictWarning === 'warn') console.warn(errorMessage);
        if (dictWarning === 'error') throw new Error(errorMessage);
        result = phrase;
      }

      result = result.replace(wildCardRegex, (replacer) => {
        const value = replaceHash[replacer];
        return value || '';
      });

      return result;
    }
  };

  i18n.useLanguage(language);

  return i18n;
}
