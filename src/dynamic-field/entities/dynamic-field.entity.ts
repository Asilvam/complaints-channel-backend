import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export type DynamicFieldDocument = DynamicField & Document;

@Schema({ collection: 'dynamic_fields', timestamps: true })
export class DynamicField {

  @ApiProperty({
    description: 'Unique identifier for the dynamic field',
    example: 'abc123def4',
  })
  @Prop({
    required: true,
    default: () => uuidv4().replace(/-/g, '').substring(0, 10),
    unique: true,
  })
  idDynamicField: string;

  @ApiProperty({
    description: 'Name of the dynamic field',
    example: 'anonymousComplaint',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Label of the dynamic field',
    example: 'Anonymous Complaint',
  })
  @Prop({ required: true })
  label: string;

  @ApiProperty({
    description: 'Type of the dynamic field',
    example: 'boolean',
    enum: ['boolean', 'text', 'email', 'text-area', 'array-text', 'date'],
  })
  @Prop({ required: true, type: String, enum: ['boolean', 'text', 'email', 'text-area', 'array-text', 'date'] })
  type: string;

  @ApiProperty({
    description: 'Visibility status of the dynamic field',
    example: true,
  })
  @Prop({ required: true })
  visible: boolean;

  @ApiProperty({
    description: 'Default value of the dynamic field',
    example: true,
  })
  @Prop({ required: true })
  default: boolean;
}

export const DynamicFieldSchema = SchemaFactory.createForClass(DynamicField);
