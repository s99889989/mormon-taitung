// utils/api.js
//http://localhost:8080/
//https://madustrialtd.asuscomm.com:8080/
// https://api.karltw.com/
export const API_BASE_URL = 'https://api.karltw.com:8080/'

export const GOOGLE_CLIENT_ID = '441605672654-9j73r51g6j2mar17ptblhskfvard1em9.apps.googleusercontent.com'

export const apiFetch = (path, options = {}) => {
  return fetch(API_BASE_URL + path, options)
}