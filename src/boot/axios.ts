import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { boot } from 'quasar/wrappers';
import Auth from 'src/api/auth';
import { Notify } from 'quasar';

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

    let message = null;

    if (error && error.response && error.response.data && error.response.data.detail) {
      message = error.response.data.detail;
    }

    if (message) {
      Notify.create({
        type: 'error',
        color: 'negative',
        timeout: 0,
        position: 'bottom',
        message,
        actions: [
          { label: 'Fermer', color: 'white' },
        ],
      });
    }

    return error;
  });

  Vue.prototype.$axios = axios;
});
