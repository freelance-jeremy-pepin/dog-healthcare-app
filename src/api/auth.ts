import { parseJwt } from 'src/utils/jwt';

interface Token {
  token: string;
  expiry: number;
}

let jwtToken: Token = {
  token: '',
  expiry: 0,
};

export const login = (token: string) => {
  jwtToken = {
    token,
    expiry: parseJwt(token).expiry,
  };
};

export const logout = () => {
  jwtToken = {
    token: '',
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
