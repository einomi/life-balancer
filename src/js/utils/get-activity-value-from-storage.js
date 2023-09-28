export const ACTIVITIES_LOCAL_STORAGE_KEY = 'life-balancer.activity-value';

/** @param {string} id */
function getKeyWithId(id) {
  return `${ACTIVITIES_LOCAL_STORAGE_KEY}.${id}`;
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
