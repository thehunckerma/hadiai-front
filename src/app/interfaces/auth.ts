export interface AuthResp {
  id: number;
  username: string;
  email: string;
  roles: 'ROLE_USER' | 'ROLE_MODERATOR';
  accessToken: string;
  tokenType: 'Bearer';
}
