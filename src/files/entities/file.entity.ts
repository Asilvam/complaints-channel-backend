import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type FileDocument = FileUpload & Document;

@Schema({ collection: 'fileUpload', timestamps: true })
export class FileUpload {
  @ApiProperty({
    description: 'The original name of the uploaded file',
    example: 'document.pdf',
  })
  @Prop({ required: true })
  originalName: string;

  @ApiProperty({
    description: 'The MIME type of the uploaded file',
    example: 'application/pdf',
  })
  @Prop({ required: true })
  mimetype: string;

  @ApiProperty({
    description: 'The size of the uploaded file in bytes',
    example: 102400,
  })
  @Prop({ required: true })
  size: number;

  @ApiProperty({
    description: 'The unique identifier of the file (optional)',
    example: '60b6c5c4f73e8b3a64d1598b',
    required: false,
  })
  @Prop()
  id?: string;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
