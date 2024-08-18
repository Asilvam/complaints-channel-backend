import { Controller, Get, Post, UseInterceptors, UploadedFile, Param, NotFoundException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileUpload } from './entities/file.entity';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // FileInterceptor to handle file upload
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to be uploaded',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The file has been successfully uploaded.',
    type: FileUpload,
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file); // Call the service to handle file
  }

  @Get('/mock')
  async getMock() {
    try {
      return this.filesService.getMock();
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      await this.filesService.getFile(id, res);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).send('File not found');
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }


}
