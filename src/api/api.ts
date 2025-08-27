import axios from "axios";

const api = axios.create({
  baseURL: 'https://dummyjson.com/products',
  timeout: 10000,
});


export default api;
