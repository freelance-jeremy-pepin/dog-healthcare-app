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

export const refreshTokenRequest = () => {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    api.post('refresh_token', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      refresh_token: jwtToken.refreshToken,
    }).then((response) => {
      login(response.data.token, response.data.refresh_token); // TODO: Améliorer
    });
  }
}

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

export const logout = () => {
  jwtToken = {
    token: '',
    refreshToken: '',
    expiry: 0,
  };

  // to support logging out from all windows
  window.localStorage.setItem('logout', String(Date.now()));
  window.location.reload();
};

export const getJwtToken = (): Token => jwtToken;

export const isAuthenticate = (): boolean => jwtToken.token !== '';

export const syncLogout = (event: any) => {
  if (event.key === 'logout') {
    console.log('logged out from storage!');
    window.location.reload();
  }
};
