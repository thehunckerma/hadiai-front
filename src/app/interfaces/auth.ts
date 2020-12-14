export interface LoginResp {
  id: number;
  username: string;
  email: string;
  roles: 'ROLE_USER' | 'ROLE_ADMIN';
  accessToken: string;
  tokenType: 'Bearer';
}
