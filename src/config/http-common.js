
import axios from 'axios';

const bodyReq = (token) => {
  return axios.create({
    // baseURL: "https://api-z5zl.onrender.com/sgacfi-api",
    baseURL: "http://ingenieria.unac.edu.co:4001/sgacfi-api/auth/ingreso",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export default bodyReq;