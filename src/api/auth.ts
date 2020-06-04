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
};

export const getJwtToken = (): Token => jwtToken;

export const isAuthenticate = (): boolean => jwtToken.token !== '';
