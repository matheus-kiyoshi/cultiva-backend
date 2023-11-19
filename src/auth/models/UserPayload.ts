import { Address } from "src/user/entities/address.entity";

export interface UserPayload {
  sub: string;
  email: string;
  name: string;
  address?: Address | null;
	telephone?: string | null;
  icon?: string | null;
  iat?: number;
  exp?: number;
}