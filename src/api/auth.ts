import { parseJwt } from 'src/utils/jwt';
import { stringToBoolean } from 'src/utils/stringFormat';
import axios from 'axios';
import UserModule from '../store/modules/user-module';
import DogModule from '../store/modules/dog-module';

interface Token {
    token: string;
    refreshToken: string;
    expiry: number;
}

export default class Auth {
    private static jwtToken: Token = {
        token: '',
        refreshToken: '',
        expiry: 0,
    };

    static get JwtToken(): Token {
        return Auth.jwtToken;
    }

    static get rememberMe(): boolean {
        const rememberMeLocalStorage = localStorage.getItem('rememberMe');
        if (rememberMeLocalStorage === null) {
            return false;
        }

        return stringToBoolean(rememberMeLocalStorage);
    }

    public static refreshTokenRequest = (): Promise<boolean> => new Promise((resolve) => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            axios.post('refresh_token', {
                // eslint-disable-next-line @typescript-eslint/camelcase
                refresh_token: refreshToken,
            }).then((response) => {
                Auth.login(response.data.token, response.data.refresh_token);
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        } else {
            resolve(false);
        }
    });

    public static login = (token: string, refreshToken: string) => {
        const tokenParsed = parseJwt(token);

        UserModule.fetch(tokenParsed.username);
        DogModule.fetchAll();

        Auth.jwtToken = {
            token,
            refreshToken,
            expiry: tokenParsed.exp,
        };

        if (Auth.rememberMe) {
            localStorage.setItem('refreshToken', Auth.jwtToken.refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }

        const refreshTokenIn = Auth.jwtToken.expiry - (Math.floor(Date.now() / 1000));
        setTimeout(() => {
            Auth.refreshTokenRequest().then();
        }, refreshTokenIn * 1000);
    };

    public static logout = (reload = true) => {
        Auth.jwtToken = {
            token: '',
            refreshToken: '',
            expiry: 0,
        };

        // to support logging out from all windows
        localStorage.setItem('logout', String(Date.now()));
        localStorage.removeItem('refreshToken');

        if (reload) {
            window.location.reload();
        }
    }

    public static isAuthenticate = (): boolean => Auth.jwtToken.token !== ''; // TODO: Vérifier expiration

    public static syncLogout = (event: StorageEvent) => {
        if (event.key === 'logout') {
            window.location.reload();
        }
    }
}
