import { LOCAL_STORAGE_ACTIVITY_VALUE_KEY } from './constants';

/** @param {string} id */
function getKeyWithId(id) {
  return `${LOCAL_STORAGE_ACTIVITY_VALUE_KEY}.${id}`;
}

/** @param {string} id */
export function getActivityValueFromStorage(id) {
  const localStorageKey = getKeyWithId(id);
  return Number(localStorage.getItem(localStorageKey));
}

/**
 * @param {string} id
 * @param {number} value
 *  */
export function setActivityValueToStorage(id, value) {
  const localStorageKey = getKeyWithId(id);
  localStorage.setItem(localStorageKey, String(value));
}
