import axios, {
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import Auth from 'src/api/auth';

export const api = axios.create({
  headers: {
    Accept: 'application/json,application/merge-patch+json',
  },
});

api.interceptors.request.use((config: AxiosRequestConfig) => {
  if (Auth.JwtToken.token) {
    config.headers.authorization = `Bearer ${Auth.JwtToken.token}`;
  }

  config.baseURL = 'http://api.dog-healthcare.com';
  return config;
});

api.interceptors.response.use((response: AxiosResponse) => response, (error) => {
  if (error.response.status === 401) {
    Auth.logout();
  }
});
