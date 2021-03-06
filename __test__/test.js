const { observe, configure } = require('../src/index');

beforeAll(()=>{
  configure({
    setLogging: true
  })
});

test('Testing -- basic object', () => {
  const data = {
    'name': 'bob'
  }
  observe(data);
  expect(data.name).toBe('bob');
  data.name = 'bill';
  expect(data.name).toBe('bill');
  expect(data.dirty).toBe(true);
  expect(data).toMatchSnapshot();
});

test('Testing -- inner object', () => {
  const data = {
    name: {
      firstName: 'Peter',
      lastName: 'Piper',
    }
  }
  observe(data);
  expect(data.name.firstName).toBe('Peter');
  expect(data.name.lastName).toBe('Piper');

  data.name = Object.assign({}, data.name, {
    suffix: 'Jr.',
    firstName: 'Charles'
  })
  expect(data.name.firstName).toBe('Charles');
  expect(data.name.suffix).toBe('Jr.');
  expect(data.dirty).toBe(true);
  expect(data).toMatchSnapshot();
});


test('Testing -- 5 layers deep', () => {
  const data = {
    one: {
      two: {
        three: {
          four: {
            five: {
              value: 'Omega'
            }
          }
        }
      }
    }
  }

  observe(data);
  expect(data.one.two.three.four.five.value).toBe('Omega');
  data.one.two.three.four.five.value = 'Alpha';
  expect(data.one.two.three.four.five.value).toBe('Alpha');
  expect(data.dirty).toBe(true);
  expect(data).toMatchSnapshot();
});

test('Testing -- json hides setter and getter', () => {
  const data = {
    address1: '100 Ball Park Ave.',
    city: 'Seattle',
    state: 'WA',
    zip: '98125'
  }

  observe(data);
  expect(data).toMatchObject({
    address1: '100 Ball Park Ave.',
    city: 'Seattle',
    state: 'WA',
    zip: '98125',
    dirty: false
  });

  expect(JSON.stringify(data)).toBe(JSON.stringify({
    dirty: false,
    address1: '100 Ball Park Ave.',
    city: 'Seattle',
    state: 'WA',
    zip: '98125'
  }))

  expect(data.dirty).toBe(false);
  expect(data).toMatchSnapshot();
});

test('Testing -- functions, regex in object', () => {
  const data = {
    sayHi: function() {
      console.log('do-wop');
    },
    name: 'Albert',
    sayGoodbye: function() {
      console.log('do-bop');
    },
    test: /^.*/g
  }

  observe(data);
  expect(data.dirty).toBe(false);
  data.sayHi();
  expect(data.dirty).toBe(false);
  data.test = /^false/;
  expect(data.dirty).toBe(true);
});

test('Testing -- watching nulls', () => {
  const data = {
    'name': null,
    'faith': undefined
  };
  observe(data);
  expect(data.name).toBe(null);
  expect(data.faith).not.toBeDefined();
  data.name = 'bill';
  expect(data.name).toBe('bill');
  expect(data.dirty).toBe(true);
  expect(data).toMatchSnapshot();
});

test('Testing -- example', () => {
  configure({
    date: true,
    name: '__modified__',  // defaults 'dirty'
    setLogging: true
  })
  const data = {
    firstName: 'Alex',
    lastName: 'Bell',
    address: {
      city: 'Seattle'
    }
  };

  observe(data);

  data.address.city = 'Shoreline';

  console.log(JSON.stringify(data, null, 2));
});
