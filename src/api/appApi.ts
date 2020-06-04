import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getJwtToken, logout } from 'src/api/auth';

export const api = axios.create();

api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (getJwtToken().token) {
    config.headers.authorization = `Bearer ${getJwtToken().token}`;
  }
  config.baseURL = 'http://api.dog-healthcare.com';
  return config;
});

api.interceptors.response.use((response: AxiosResponse) => response, (error) => {
  if (error.response.status === 401) {
    logout();
  }
});
