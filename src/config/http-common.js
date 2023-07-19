
import axios from 'axios';

const bodyReq = (token) => {
  return axios.create({
    baseURL: "https://api-z5zl.onrender.com/sgacfi-api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export default bodyReq;