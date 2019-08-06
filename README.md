<h1 align="center" style="border-bottom: none;">redux-persistence-engine-localstorage</h1>
<h3 align="center">LocalStorage engine for redux-persistence</h3>

## Installation

    npm install --save redux-persistence-engine-localstorage

## Usage

Stores everything inside `window.localStorage`.

```js
import createEngine from 'redux-persistence-engine-localstorage'
const engine = createEngine('my-save-key')
```

You can customize the saving and loading process by providing a [`replacer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter) and/or a [`reviver`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter).

```js
import createEngine from 'redux-storage-engine-localstorage';

function replacer (key, value) {
  if (typeof value === 'string') {
    return 'foo';
  }
  return value;
}

function reviver (key, value) {
  if (key === 'foo') {
    return 'bar';
  }
  return value;
});

const engine = createEngine('my-save-key', replacer, reviver);
```

**Warning**: `localStorage` does not expose a async API and every save/load
operation will block the JS thread!

**Warning**: This library only works on browsers that support Promises (IE11 or better)

**Warning**: If the browser doest not support LocalStorage, that should be handled before passing the engine to `redux-persistence` (see test)
