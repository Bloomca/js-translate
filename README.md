# JS-TRANSLATE
[![Build Status](https://travis-ci.org/Bloomca/js-translate.svg?branch=master)](https://travis-ci.org/Bloomca/js-translate)

Very easy i18n library. Just load your data, and then start to translate.
- supports wildcards
- supports regional dialects with residing to global
- several levels of warning

# Usage

```javascript
import { i18n } from 'js-translate';

// init current language and default language
const translator = i18n({ language: 'en', defaultLanguage: 'en' });
// fill dictionary
translator.add([{
    language: 'en',
    data: {
        'my string': 'Some translated stuff!',
        'string with {params}': '{params} is here!'
    }
}]);

// use
translator.translate('string with {params}', 'Date');
-> Date is here!

// change language
translator.useLanguage('ta');
```


You could specify several translators, with different parameters. If default wildcards isn't appropriate to you, then you could change it:
```javascript
const translator = i18n({ language: 'en', startSeparator: '{{', endSeparator: '}}' });
```

And again, all instansiated translators don't share these settings.


---------------

© 2015 MIT
