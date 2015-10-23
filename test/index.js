import chai from 'chai';

import { i18n as createLocalization, parseArguments } from '../src/index';

const assert = chai.assert;

suite('i18n functionality', () => {
  test('should support string and object additions', () => {
    const [ dictionary, defaultLanguage ] = parseArguments(['ta', { 'first_phrase': 'some jibberish' }]);

    assert.equal(defaultLanguage, 'ta');
    assert.deepEqual(dictionary, { ta: { 'first_phrase': 'some jibberish' } });
  });

  test('should support list of languages notation', () => {
    const [ dictionary, defaultLanguage ] = parseArguments([
      {
        language: 'hi',
        data: { 'first': 'second' }
      },
      {
        language: 'ta',
        data: { 'first': 'second' }
      }
    ]);

    assert.equal(defaultLanguage, 'hi');
    assert.deepEqual(dictionary, { ta: { 'first': 'second' }, hi: { 'first': 'second' } });
  });

  test('should correctly translate basic phrases', () => {
    const i18n = createLocalization({ language: 'ta' });

    i18n.add('ta', { 'first_phrase': 'some jibberish' });

    assert.equal(i18n.translate('first_phrase'), 'some jibberish');
  });

  test('should support single replacement', () => {
    const i18n = createLocalization({ language: 'ta' });

    i18n.add('ta', { 'hello {name}': '{name}, hello' });

    assert.equal(i18n.translate('hello {name}', 'jane'), 'jane, hello');
  });

  test('should support several replacements', () => {
    const i18n = createLocalization({ language: 'ta' });

    i18n.add('ta', { '{word} {name}': '{name} {word}' });

    assert.equal(i18n.translate('{word} {name}', 'hello', 'world'), 'world hello');
  });

  test('should reside correctly', () => {
    const i18n = createLocalization({ language: 'en-US', defaultLanguage: 'hi' });

    assert.equal(i18n.getResideLanguage(), 'en');
  });

  test('should get resided data correctly', () => {
    const i18n = createLocalization({ language: 'en-US', defaultLanguage: 'hi' });

    i18n.add([
      {
        language: 'hi',
        data: {
          'new': 'another stuff',
          'another_key': 'data from hi'
        }
      },
      {
        language: 'en',
        data: {
          'first': 'second',
          'new': 'nouvelle'
        }
      },
      {
        language: 'en-US',
        data: {
          'first': 'second'
        }
      }
    ]);

    assert.equal(i18n.translate('new'), 'nouvelle');
    assert.equal(i18n.translate('another_key'), 'data from hi');
  });
});
