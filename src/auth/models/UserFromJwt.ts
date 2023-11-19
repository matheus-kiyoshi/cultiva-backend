import { Prisma } from "@prisma/client";
import { Address } from "src/user/entities/address.entity";

export interface UserFromJwt {
  id: string;
  email: string;
  name: string;
  address?: Address | null;
	telephone?: string | null;
  icon?: string | null;
}