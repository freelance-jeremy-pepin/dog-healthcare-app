/* eslint-disable */
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { boot } from 'quasar/wrappers';
import Auth from 'src/api/auth';
import { Notify } from 'quasar';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';
import Date from 'src/utils/date';
import DateTime from 'src/utils/dateTime';

declare module 'vue/types/vue' {
    interface Vue {
        $axios: AxiosInstance;
    }
}

function convertDatesToAppDate(data: Array<any> | object) {
    if (Array.isArray(data)) {
        data.forEach((line: any) => {
            if (typeof line === 'object') {
                line = convertDatesToAppDate(line);
            }
        });
    } else if (typeof data === 'object') {
        // eslint-disable-next-line guard-for-in
        for (const property in data) {
            // @ts-ignore
            let propertyValue: string | object = data[property];

            if (typeof propertyValue === 'string') {
                if (propertyValue.match(DateTime.databaseFormatRegex)) {
                    // @ts-ignore
                    data[property] = DateTime.databaseToApp(propertyValue);
                } else if (propertyValue.match(Date.databaseFormatRegex)) {
                    // @ts-ignore
                    data[property] = Date.databaseToApp(propertyValue);
                }
            } else if (propertyValue && typeof propertyValue === 'object') {
                // @ts-ignore
                data[property] = convertDatesToAppDate(propertyValue);
            }
        }
    }

    return data;
}

function convertDatesToDatabaseDate(data: Array<any> | object) {
    if (Array.isArray(data)) {
        data.forEach((line: any) => {
            if (typeof line === 'object') {
                line = convertDatesToDatabaseDate(line);
            }
        });
    } else if (typeof data === 'object') {
        // eslint-disable-next-line guard-for-in
        for (const property in data) {
            // @ts-ignore
            let propertyValue: string | object = data[property];

            if (typeof propertyValue === 'string') {
                if (propertyValue.match(DateTime.appFormatRegex)) {
                    // @ts-ignore
                    data[property] = DateTime.appToDatabase(propertyValue);
                } else if (propertyValue.match(Date.appFormatRegex)) {
                    // @ts-ignore
                    data[property] = Date.appToDatabase(propertyValue);
                }
            } else if (propertyValue && typeof propertyValue === 'object') {
                // @ts-ignore
                data[property] = convertDatesToAppDate(propertyValue);
            }
        }
    }

    return data;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default boot(({ Vue }) => {
    axios.defaults.headers.common.Accept = 'application/json';

    axios.interceptors.request.use((config: AxiosRequestConfig) => {
        if (Auth.JwtToken.token) {
            config.headers.authorization = `Bearer ${Auth.JwtToken.token}`;
        }

        config.baseURL = 'http://api.dog-healthcare.com/api';
        if (config.data) {
            config.data = convertDatesToDatabaseDate(config.data);

            config = {
                ...config,
                data: snakecaseKeys(config.data, { deep: true }),
            };
        }

        return config;
    });

    axios.interceptors.response.use((response: AxiosResponse) => {
        if (response.data) {
            response.data = convertDatesToAppDate(response.data);

            response = {
                ...response,
                data: camelcaseKeys(response.data, { deep: true }),
            };
        }

        return response;
    }, (error) => {
        if (error.response.status === 401) {
            Auth.logout();
        }

        return Promise.reject(error);
    });

    Vue.prototype.$axios = axios;
});
