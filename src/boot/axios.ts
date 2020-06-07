import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { boot } from 'quasar/wrappers';
import Auth from 'src/api/auth';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  axios.defaults.headers.common.Accept = 'application/json';

  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    if (Auth.JwtToken.token) {
      config.headers.authorization = `Bearer ${Auth.JwtToken.token}`;
    }

    config.baseURL = 'http://api.dog-healthcare.com';
    return config;
  });

  axios.interceptors.response.use((response: AxiosResponse) => response, (error) => {
    if (error.response.status === 401) {
      Auth.logout();
    }
  });

  Vue.prototype.$axios = axios;
});
