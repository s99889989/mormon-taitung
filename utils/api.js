// utils/api.js
//http://localhost:8080/
//https://madustrialtd.asuscomm.com:8080/
export const API_BASE_URL = 'https://madustrialtd.asuscomm.com:8080/'

export const apiFetch = (path, options = {}) => {
  return fetch(API_BASE_URL + path, options)
}
