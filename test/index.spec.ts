import test from 'ava'
import sinon from 'sinon'
import createEngine from '../src'

test.beforeEach(() => {
  global['localStorage'] = {
    getItem: sinon.stub().returns(null),
    setItem: sinon.stub()
  }
})

test.afterEach(() => {
  delete global['localStorage']
})

test('should load via getItem', async t => {
  const engine = createEngine('key')

  global['localStorage'].getItem.returns('{"a":1}')

  const result = await engine.load()

  t.is(global['localStorage'].getItem.called, true)
  t.deepEqual(result, { a: 1 })
})

test('should load with the given key', async t => {
  const engine = createEngine('key')
  await engine.load()
  t.is(global['localStorage'].getItem.calledWith('key'), true)
})

test('should throw if localStorage is not present', async t => {
  global['localStorage'] = undefined
  try {
    createEngine('key')
  } catch (e) {
    t.is(e.message, 'Missing LocalStorage in window context')
  }
})

test('should thow if json cannot be loaded', async t => {
  global['localStorage'].getItem = sinon.stub().returns('{"a')

  const engine = createEngine('key')

  try {
    await engine.load()
  } catch (e) {
    t.truthy(e)
  }
})

test('should use a provided reviver on load', async t => {
  const reviver = sinon.stub()
  const engine = createEngine('key', null, reviver)
  await engine.load()
  t.is(reviver.called, true)
})

test('should save via setItem', async t => {
  const engine = createEngine('key')
  await engine.save({})
  t.is(global['localStorage'].setItem.called, true)
})

test('should save with the given key', async t => {
  const engine = createEngine('key')
  await engine.save({})

  t.is(global['localStorage'].setItem.calledWith('key'), true)
})

test('should save the passed state as json', async t => {
  const engine = createEngine('key')
  await engine.save({ a: 1 })

  t.is(global['localStorage'].setItem.calledWith('key', '{"a":1}'), true)
})

test('should reject if json cannot be serialized', async t => {
  const engine = createEngine('key')
  const a: any = {}
  a.a = a

  try {
    await engine.save(a)
  } catch (e) {
    t.truthy(e)
  }
})

test('should use a provided replacer on save', async t => {
  const replacer = sinon.stub()
  const engine = createEngine('key', replacer)

  await engine.save({})

  t.is(replacer.called, true)
})

test('should throw errors as-is', async t => {
  global['localStorage'].setItem = sinon.stub().throws(new Error('boo'))

  const engine = createEngine('key')

  try {
    await engine.save({})
  } catch (e) {
    t.is(e.message, 'boo')
  }
})
