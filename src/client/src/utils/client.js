import axios from "axios";
const host = document.location.origin;

const client = {
  get: (path) => {
    const url = `${host}${path}`;

    return axios.get(url);
  },

  post: (path, data) => {
    const url = `${host}${path}`;

    return axios.post(url, data);
  },
};

export default client;
