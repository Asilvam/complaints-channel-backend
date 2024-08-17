import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileSchema } from './entities/file.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FileSchema }])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
