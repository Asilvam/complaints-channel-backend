import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { FileUpload, FileDocument } from './entities/file.entity';
import { Response } from 'express';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private gridFSBucket: GridFSBucket;

  constructor(
    @InjectModel('FileUpload')
    private readonly fileModel: Model<FileDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    const mongoClient = this.connection.getClient();
    this.gridFSBucket = new GridFSBucket(mongoClient.db(), {
      bucketName: 'fileUpload',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ id: string }> {
    try {
      const uploadStream = this.gridFSBucket.openUploadStream(file.filename || file.originalname, {
        metadata: {
          mimetype: file.mimetype,
          originalName: file.originalname,
        },
      });
      this.logger.log('File uploaded successfully');
      await new Promise<FileUpload>((resolve, reject) => {
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null); // End of stream
        bufferStream
          .pipe(uploadStream)
          .on('error', (err) => {
            this.logger.error('Upload failed:', err);
            reject(err);
          })
          .on('finish', () => {
            const newFile = new this.fileModel({
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
              id: uploadStream.id, // Ensure it's a string
            });
            resolve(newFile.save());
          });
      });
      return { id: uploadStream.id.toHexString() };
    } catch (error) {
      this.logger.error('An error occurred during file upload:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async getFile(id: string, res: Response): Promise<void> {
    try {
      // Convert string ID to ObjectId
      const objectId = new ObjectId(id);

      // Retrieve file metadata from the database
      const file = await this.fileModel.findOne({ id: objectId }).exec();
      if (!file) {
        throw new NotFoundException('File not found');
      }

      // Stream the file from GridFS to the response
      const downloadStream = this.gridFSBucket.openDownloadStream(objectId);

      // Set headers
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=${file.originalName}`);

      // Stream file data to the response
      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        this.logger.error(`Error streaming file: ${err.message}`);
        res.status(500).send('Error downloading file');
      });

      downloadStream.on('end', () => {
        this.logger.log('File downloaded successfully');
      });
    } catch (error) {
      this.logger.error(error.message);
      throw new NotFoundException('File not found or could not be retrieved');
    }
  }
}
