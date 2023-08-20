export const LEARN_ITEMS_LOCAL_STORAGE_KEY = 'life-balancer.learn-item';

/** @param {string} id */
function getKeyWithId(id) {
  return `${LEARN_ITEMS_LOCAL_STORAGE_KEY}.${id}`;
}

/** @param {string} id */
export function getLearnItemValueFromStorage(id) {
  const localStorageKey = getKeyWithId(id);
  return Number(localStorage.getItem(localStorageKey));
}

/**
 * @param {string} id
 * @param {number} value
 *  */
export function setLearnItemValueToStorage(id, value) {
  const localStorageKey = getKeyWithId(id);
  localStorage.setItem(localStorageKey, String(value));
}
