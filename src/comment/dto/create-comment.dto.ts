import { IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { Comment } from "../entities/comment.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto extends Comment {
	@ApiProperty({
		example: 'So good!',
		description: 'The content of the comment',
		required: true,
		type: 'string'
	})
	@IsString()
	@MaxLength(255)
	content: string;
	
	@ApiProperty({
		example: 5,
		description: 'The rating you give to the product',
		required: true,
		type: 'number',
	})
	@IsNumber()
	@Min(1)
	@Max(5)
	rating: number;
}
