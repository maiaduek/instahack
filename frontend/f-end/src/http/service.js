import axios from 'axios';
import { url } from './url';


// GET request- route, headers
export const get = route => {
  const token = localStorage.getItem("token");
  console.log("in service.js get, this was taken out of localStorage", token)

  return axios.get(`${url}${route}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  });
};


// POST request- route, body, headers
export const post = (route, body) => {
  const token = localStorage.getItem("token");
  console.log("in service.js post, this was taken from localStorage", token);
  console.log("BODY::", body)
  return axios.post(`${url}${route}`, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  });
};