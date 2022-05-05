import axios from 'axios';
import { url } from './url';


// GET request- route, headers
export const get = route => {
  const token = localStorage.getItem("token");

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