import { StorageEngine } from 'redux-persistence/dist/types'
import { Replacer, Reviver } from './types'

function isLocalStorageAvailable() {
  try {
    return typeof localStorage !== 'undefined' && 'setItem' in localStorage && typeof localStorage.setItem === 'function'
  } catch (e) {
    return false
  }
}

/**
 * Returns a new `StorageEngine` which saves data to the browser's LocalStorage.
 *
 * Throws if `localStorage` is not present on the `window` object.
 */
export default <T>(key: string, replacer?: Replacer, reviver?: Reviver): StorageEngine<T> => {
  if (!isLocalStorageAvailable()) {
    throw new Error('Missing LocalStorage in window context')
  }
  return {
    async load() {
      const jsonState = localStorage.getItem(key)
      return JSON.parse(jsonState, reviver) || {}
    },

    async save(state) {
      const jsonState = JSON.stringify(state, replacer)
      localStorage.setItem(key, jsonState)
    }
  }
}
