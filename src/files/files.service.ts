import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Readable } from 'stream';
import { FileUpload, FileDocument } from './entities/file.entity';
import { Response } from 'express';

export interface IDynamicField {
  name: string;
  label: string;
  type: 'boolean' | 'text' | 'email' | 'text-area' | 'array-text' | 'file'; // Restricting to valid types
  visible: boolean;
  default: boolean | string;
}

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
              id: uploadStream.id.toHexString(), // Ensure it's a string
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
      const objectId = new ObjectId(id);
      const file = await this.fileModel.findOne({ id: objectId }).exec();
      if (!file) {
        throw new NotFoundException('File not found');
      }
      const downloadStream = this.gridFSBucket.openDownloadStream(objectId);
      res.setHeader('Content-Type', file.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename=${file.originalName}`);
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

  async getMock(): Promise<IDynamicField[]> {
    this.logger.log('Getting mock data');
    try {
      const dynamicField: IDynamicField[] = [
        { name: 'anonymousComplaint', label: 'Anonymous Complaint', type: 'boolean', visible: true, default: true },
        { name: 'companyRelationship', label: 'Company Relationship', type: 'text', visible: false, default: true },
        { name: 'email', label: 'Email', type: 'email', visible: true, default: true },
        { name: 'incidentDetail', label: 'Incident details', type: 'text-area', visible: true, default: true },
        { name: 'witnesses', label: 'Witnesses of the incident', type: 'text', visible: true, default: true },
        { name: 'involved', label: 'Mentions those involved', type: 'text', visible: true, default: true },
        { name: 'complaintType', label: 'Type of complaint', type: 'array-text', visible: true, default: true },
        { name: 'attachments', label: 'Attachments', type: 'file', visible: true, default: true },
      ];
      return dynamicField;
    } catch (error) {
      this.logger.error(error.message);
      throw new NotFoundException('Mock data not found');
    }
  }
}
