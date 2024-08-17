import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // FileInterceptor to handle file upload
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file); // Call the service to handle file
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file: any | null = await this.filesService.getFile(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${file.originalName}`,
    );
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Length', file.size.toString());
    res.send(file.data); // Using `res.send` to send the file data
  }
}
