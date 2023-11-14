import { Controller, Get, Post, Body, Patch, Param, Delete, Request, HttpCode } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth('JWT-auth')
  @Post(':id')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create comment' })
  create(@Request() req: AuthRequest, @Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    if (req.user.id) {
      return this.commentService.create(req.user.id, id, createCommentDto);
    } else {
      throw new Error('Unauthorized');
    }
  }

  @IsPublic()
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all comments' })
  findAll() {
    return this.commentService.findAll();
  }

  @IsPublic()
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get comment by id' })
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update comment' })
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete comment' })
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
