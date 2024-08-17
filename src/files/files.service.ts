import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

@Injectable()
export class FilesService {
  logger = new Logger(FilesService.name);
  private gridFSBucket: GridFSBucket;

  constructor(
    @InjectModel('File')
    private fileModel: Model<File>,
    @InjectConnection() private readonly connection: Connection, // Inject the connection
  ) {
    const mongoClient = this.connection.getClient();
    this.gridFSBucket = new GridFSBucket(mongoClient.db(), {
      bucketName: 'uploads',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<File> {
    try {
      const uploadStream = this.gridFSBucket.openUploadStream(
        file.originalname,
        {
          metadata: {
            mimetype: file.mimetype,
            size: file.size,
          },
        },
      );
      const responseUploadFile = new Promise<File>((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null); // End of stream
        bufferStream
          .pipe(uploadStream)
          .on('error', reject)
          .on('finish', () => {
            const newFile = new this.fileModel({
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              data: file.buffer,
              _id: uploadStream.id,
            });
            resolve(newFile.save());
          });
      });
      if (responseUploadFile) {
        return responseUploadFile;
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getFile(id: string): Promise<File> {
    const file = await this.fileModel.findOne({ _id: id }).exec();
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }
}
