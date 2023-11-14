import { Controller, Post, UseInterceptors, Request, UploadedFiles, HttpCode, Response, HttpException, Param } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { uploadImages } from './middlewares/firebase-upload.middleware';
import { AuthRequest } from 'src/auth/models/AuthRequest';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Firebase Upload')
@Controller('firebase')
export class FirebaseController {
  constructor(
    private readonly firebaseService: FirebaseService
  ) {}

  @ApiBearerAuth('JWT-auth')
  @Post('icon')
  @UseInterceptors(FilesInterceptor('file'))
  @HttpCode(200)
  @ApiOperation({ summary: 'Upload icon' })
  async uploadFile(@Request() auth: AuthRequest, @UploadedFiles() files: any, @Request() req: ExpressRequest) {
    if (!auth.user) throw new HttpException('Unauthorized', 401)

    const firebaseUrl = await uploadImages(req)
    if (!firebaseUrl) throw new HttpException('Error uploading file', 500)

    if (auth.user.id)
      return this.firebaseService.addIconToUser(auth.user.id, firebaseUrl[0])
  }

  @ApiBearerAuth('JWT-auth')
  @Post('product/:id')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  @ApiOperation({ summary: 'Upload product images' })
  async uploadFiles(@Request() auth: AuthRequest, @Param('id') id: string, @UploadedFiles() files: any, @Request() req: ExpressRequest) {
    if (!auth.user || !id) throw new HttpException('Unauthorized', 401)

    const firebaseUrl = await uploadImages(req)
    if (!firebaseUrl) throw new HttpException('Error uploading files', 500)

    if (auth.user.id && id)
      return this.firebaseService.addImagesToProducts(auth.user.id, id, firebaseUrl)
  }
}
