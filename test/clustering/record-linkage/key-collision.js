/**
 * Talisman clustering/record-linkage/naive tests
 * ===============================================
 *
 */
import assert from 'assert';
import fingerprint from '../../../src/tokenizers/fingerprint';
import doubleMetaphone from '../../../src/phonetics/double-metaphone';
import keyCollision from '../../../src/clustering/record-linkage/key-collision';

const SIMPLE = [
  'University of North Carolina',
  'North, Carolina, University of',
  'university of   north carolIna',
  'M. Smith',
  'Smith M.'
];

const PHONETIC = [
  'Smith',
  'Schmidt',
  'Smyth',
  'Smit',
  'Paul',
  'Pol'
];

describe('key-collision', function() {

  it('should throw if the keyer function is invalid.', function() {
    assert.throws(function() {
      keyCollision({key: null}, []);
    }, /keyer/);
  });

  it('should correctly compute clusters.', function() {
    const clusters = keyCollision({
      key: a => fingerprint(a).join(' ')
    }, SIMPLE);

    assert.deepEqual(clusters, [
      [
        'University of North Carolina',
        'North, Carolina, University of',
        'university of   north carolIna'
      ],
      [
        'M. Smith',
        'Smith M.'
      ]
    ]);
  });

  it('should ignore falsey keys.', function() {
    const clusters = keyCollision({
      key: a => {
        if (/smith/i.test(a))
          return;

        return fingerprint(a).join(' ');
      }
    }, SIMPLE);

    assert.deepEqual(clusters, [
      [
        'University of North Carolina',
        'North, Carolina, University of',
        'university of   north carolIna'
      ]
    ]);
  });

  it('should correctly compute clusters with composite keys.', function() {
    const clusters = keyCollision({
      keys: doubleMetaphone
    }, PHONETIC);

    assert.deepEqual(clusters, [
      ['Smith', 'Smyth'],
      ['Smith', 'Schmidt', 'Smyth', 'Smit'],
      ['Schmidt', 'Smit'],
      ['Paul', 'Pol']
    ]);
  });
});
