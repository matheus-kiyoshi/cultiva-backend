import { Prisma } from "@prisma/client"

export class Address implements Prisma.AddressUncheckedCreateInput {
	id?: string
	street: string
	number: number
	district: string
	complement: string
	cep: string
	city: string
	state: string
	userId?: string | null
}
