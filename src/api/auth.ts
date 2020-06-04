import { parseJwt } from 'src/utils/jwt';
import { api } from 'src/api/appApi';

interface Token {
  token: string;
  refreshToken: string;
  expiry: number;
}

let jwtToken: Token = {
  token: '',
  refreshToken: '',
  expiry: 0,
};

export const refreshTokenRequest = (): Promise<boolean> => new Promise((resolve) => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    api.post('refresh_token', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      refresh_token: refreshToken,
    }).then((response) => {
      login(response.data.token, response.data.refresh_token); // TODO: Améliorer
      resolve(true);
    }).catch(() => {
      resolve(false);
    });
  } else {
    resolve(false);
  }
});

export const login = (token: string, refreshToken: string) => {
  const tokenParsed = parseJwt(token);
  jwtToken = {
    token,
    refreshToken,
    expiry: tokenParsed.exp,
  };

  localStorage.setItem('refreshToken', jwtToken.refreshToken);

  const refreshTokenIn = jwtToken.expiry - (Math.floor(Date.now() / 1000));
  setTimeout(() => {
    refreshTokenRequest();
  }, refreshTokenIn * 1000);
};

export const logout = (reload = true) => {
  jwtToken = {
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
};

export const getJwtToken = (): Token => jwtToken;

export const isAuthenticate = (): boolean => jwtToken.token !== ''; // TODO: Vérifier expiration

export const syncLogout = (event: any) => {
  if (event.key === 'logout') {
    console.log('logged out from storage!');
    window.location.reload();
  }
};
