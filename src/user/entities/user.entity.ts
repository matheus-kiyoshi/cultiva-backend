import { Prisma } from "@prisma/client";

export class User implements Prisma.UserUncheckedCreateInput {
	id?: string
	name: string
	email: string
	password: string
	icon?: string | null
	token?: string | null
	telephone?: string | null
	addressId?: string | null
	rating?: Prisma.UserCreateratingInput | number[]
	createdAt?: Date | string
	address?: Prisma.AddressUncheckedCreateNestedOneWithoutUserInput
	producer?: Prisma.ProducerUncheckedCreateNestedOneWithoutUserInput
	client?: Prisma.ClientUncheckedCreateNestedOneWithoutUserInput
	comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput
	accessToken?: string;
}
