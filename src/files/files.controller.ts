import { Controller, Get, Post, UseInterceptors, UploadedFile, Param, NotFoundException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { FileUpload } from './entities/file.entity';
import { Response } from 'express';

@ApiTags('Files Evidences upload - download')
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
  @ApiOperation({ summary: 'Get mock data' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved mock data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getMock() {
    try {
      return this.filesService.getMock();
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a file by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the file',
    required: true,
    example: '60b6c5c4f73e8b3a64d1598b',
  })
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'File not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
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
