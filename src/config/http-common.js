
import axios from 'axios';

const bodyReq = (token) => {
  return axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
};

export default bodyReq;