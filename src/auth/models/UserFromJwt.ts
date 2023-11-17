export interface UserFromJwt {
  id: string;
  email: string;
  name: string;
	telephone?: string | null;
  icon?: string | null;
}