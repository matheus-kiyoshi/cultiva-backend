export interface UserPayload {
  sub: string;
  email: string;
  name: string;
	telephone?: string | null;
  icon?: string | null;
  iat?: number;
  exp?: number;
}