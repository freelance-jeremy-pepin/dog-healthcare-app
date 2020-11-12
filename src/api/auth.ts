import { parseJwt } from 'src/utils/jwt';
import { stringToBoolean } from 'src/utils/stringFormat';
import UserModule from '../store/modules/user-module';
import DogModule from '../store/modules/dog-module';

interface Token {
    token: string;
    expiry: number;
}

export default class Auth {
    private static jwtToken: Token = {
        token: '',
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

    public static login(token: string) {
        const tokenParsed = parseJwt(token);

        UserModule.fetchMe();
        DogModule.fetchAll();

        Auth.jwtToken = {
            token,
            expiry: tokenParsed.exp,
        };

        localStorage.setItem('token', token);
    }

    public static logout(reload = true) {
        Auth.jwtToken = {
            token: '',
            expiry: 0,
        };

        // to support logging out from all windows
        localStorage.setItem('logout', String(Date.now()));
        localStorage.removeItem('token');

        if (reload) {
            window.location.reload();
        }
    }

    public static isAuthenticate(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            this.login(token);
        }

        return Auth.jwtToken.token !== ''; // TODO: Vérifier expiration
    }

    public static syncLogout(event: StorageEvent) {
        if (event.key === 'logout') {
            window.location.reload();
        }
    }
}
