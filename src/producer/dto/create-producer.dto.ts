import { IsOptional, IsString } from "class-validator";
import { Producer } from "../entities/producer.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProducerDto extends Producer {
	@ApiProperty({
		description: 'Producer cpf',
		example: '000.000.000-00',
		type: 'string',
		required: false
	})
	@IsOptional()
	@IsString()
	cpf: string | null | undefined;

	@ApiProperty({
		description: 'Producer cnpj',
		example: '00.000.000/0000-00',
		type: 'string',
		required: false
	})
	@IsOptional()
	@IsString()
	cnpj: string | null | undefined;
}
