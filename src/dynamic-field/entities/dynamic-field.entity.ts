import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type DynamicFieldDocument = DynamicField & Document;

@Schema({ collection: 'dynamic_fields', timestamps: true })
export class DynamicField {
  @Prop({
    required: true,
    default: () => uuidv4().replace(/-/g, '').substring(0, 10),
    unique: true,
    select: true,
  })
  idDynamicField: string;

  @Prop({ required: true, select: true })
  name: string;

  @Prop({ required: true, select: true })
  label: string;

  @Prop({ required: true, type: String, enum: ['boolean', 'text', 'email', 'text-area', 'array-text'], select: true })
  type: string;

  @Prop({ required: true, select: true })
  visible: boolean;

  @Prop({ required: true, select: true })
  default: boolean;
}

export const DynamicFieldSchema = SchemaFactory.createForClass(DynamicField);
