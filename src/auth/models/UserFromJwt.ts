export interface UserFromJwt {
  id: string;
  email: string;
  name: string;
	telephone?: string | null;
	addressId?: string | null;
}