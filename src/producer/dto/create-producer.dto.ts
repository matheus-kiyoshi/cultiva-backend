import { IsOptional, IsString } from "class-validator";
import { Producer } from "../entities/producer.entity";

export class CreateProducerDto extends Producer {
	@IsOptional()
	@IsString()
	cpf: string | null | undefined;

	@IsOptional()
	@IsString()
	cnpj: string | null | undefined;
}
