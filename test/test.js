import path from 'path'

import test from 'ava'
import fsp from '..'

const fixturesPath = path.join(__dirname, 'fixtures');
const fooJSON = path.join(fixturesPath, 'foo.json');

test('readJSON should throw file not found error if the file does not exist', t => {
  fsp.readJSON('404.json', (err, content) => {
    t.is(err, 'filename for filepath required')
  })
});

test('readJSON should return json content', t => {
  fsp.readJSON(fooJSON, (err, content) => {
    t.plan(2)
    t.falsy(err, 'this should never happen')
    t.deepEqual(content, {
      name: 'foo'
    })
  })
});

test('readJSON should be sync method if no callback/readJSONSync', t => {
  const content = fsp.readJSON(fooJSON)
  t.deepEqual(content, {
    name: 'foo'
  })
});

test('readJSONSync should throw error if file not exist', t => {
  t.throws(_ => {
    fsp.readJSONSync('404.json')
  }, 'filename or filepath required')
});

test('writeJSON should throw error if no filename/filepath specificed', t => {
  t.throws(_ => {
    fsp.writeJSON(null, ['error'])
  }, 'filename or filepath required')
});

test('writeJSOn should write file to json', t => {
  const bazJSON = path.join(fixturesPath, 'baz.json')
  fsp.writeJSON(bazJSON, { name: 'baz'}, (err, wat) => {
    t.plan(2)
    t.falsy(err, 'this should never happen')
    t.deepEqual(fsp.readJSON(bazJSON), {
      name: 'baz'
    })
  })
});

test('writeJSONSync should write json to file', t => {
  t.deepEqual(fsp.writeJSONSync(path.join(fixturesPath, 'bar.json'), {name: 'bar'}), {
    name: 'bar'
  })
});

test('updateJSON should update JSON instead of overwrite', t => {
  const pooJSON = path.join(fixturesPath, 'poo.json')
  fsp.writeJSON(pooJSON, { name: 'poo', age: 12})
  t.deepEqual(fsp.updateJSON(pooJSON, {age: 24}), {
    name: 'poo',
    age: 24
  })
})

test('updateJSON should create file if target is non-existed', t => {
  t.deepEqual(fsp.updateJSON(path.join(fixturesPath, 'boo.json'), { name: 'boo' }), {
    name: 'boo'
  })
})
