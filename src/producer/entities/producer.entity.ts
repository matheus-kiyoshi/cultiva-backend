import { Prisma } from "@prisma/client"

export class Producer implements Prisma.ProducerUncheckedCreateInput {
	userId: string
	cpf?: string | null
	cnpj?: string | null
	products?: Prisma.ProductUncheckedCreateNestedManyWithoutProducerInput
	sales?: Prisma.SaleUncheckedCreateNestedManyWithoutProducerInput
}