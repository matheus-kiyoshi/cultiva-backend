import { IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { Comment } from "../entities/comment.entity";

export class CreateCommentDto extends Comment {
	@IsString()
	@MaxLength(255)
	content: string;
	
	@IsNumber()
	@Min(1)
	@Max(5)
	rating: number;
}
