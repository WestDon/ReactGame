export function getLocalStorageValue(key) {
    let localStorage = window.localStorage;
    return localStorage.getItem(key);
}
export function addOrUpdateLocalStorageValue(key, value) {
    let localStorage = window.localStorage;
    localStorage.setItem(key, value);
}
export function deleteLocalStorageValue(key) {
    let localStorage = window.localStorage;
    localStorage.removeItem(key);
}