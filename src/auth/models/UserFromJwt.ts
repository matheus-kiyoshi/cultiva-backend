import { Address, Client, Comment, Producer } from "src/user/entities/user.entity";

export interface UserFromJwt {
  id: string;
  email: string;
  name: string;
	telephone?:	string;
	address?: Address;
	rating: number[];
	createdAt: Date;
	producer?: Producer;
	client?: Client;
	comments?: Comment[];
}