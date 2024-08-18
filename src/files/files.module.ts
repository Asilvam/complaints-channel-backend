import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileUploadSchema } from './entities/file.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'FileUpload', schema: FileUploadSchema }])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
