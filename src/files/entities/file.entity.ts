import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = FileUpload & Document;

@Schema({ collection: 'fileUpload', timestamps: true })
export class FileUpload {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop()
  id?: string;
}

export const FileUploadSchema = SchemaFactory.createForClass(FileUpload);
