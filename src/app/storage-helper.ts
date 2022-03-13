
const KEY_PREFIX = 'SAP'

function setValue(key: string, value: string) {
  localStorage.setItem(`${KEY_PREFIX}_${key}`, value);
}

function getValue(key: string) {
  return localStorage.getItem(`${KEY_PREFIX}_${key}`);
}

function removeValue(key: string) {
  return localStorage.removeItem(`${KEY_PREFIX}_${key}`);
}

export const storageKeys = {
  authToken: 'AUTH_TOKEN'
}

export const storageHelper = {
  setValue,
  getValue,
  removeValue
}
