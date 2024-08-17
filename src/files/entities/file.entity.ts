import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema({ collection: 'file', timestamps: true })
export class File {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ required: true })
  size: number;

  @Prop({ type: Buffer, required: true }) // Add this line
  data: Buffer; // Field to store file data as a Buffer
}

export const FileSchema = SchemaFactory.createForClass(File);
