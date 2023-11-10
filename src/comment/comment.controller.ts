import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':id')
  create(@Request() req: AuthRequest, @Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    if (req.user.id) {
      return this.commentService.create(req.user.id, id, createCommentDto);
    } else {
      throw new Error('Unauthorized');
    }
  }

  @IsPublic()
  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @IsPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
