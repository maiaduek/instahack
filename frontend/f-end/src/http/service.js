import axios from 'axios';
import { url } from './url';


// GET request- route, headers
export const get = route => {
  const token = localStorage.getItem("token");
  // console.log("in service.js get, this was taken out of localStorage", token)

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
  // console.log("in service.js post, this was taken from localStorage", token);

  return axios.post(`${url}${route}`, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    }
  });
};

export const postFile = (route, formData) => {
  const token = localStorage.getItem("token");

  return axios.post(`${url}${route}`, formData, {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      Authorization: token
    }
  });
}