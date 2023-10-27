export interface UserPayload {
  sub: string;
  email: string;
  name: string;
	telephone?: string | null;
	addressId?: string | null;
  iat?: number;
  exp?: number;
}