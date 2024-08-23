import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({
    required: true,
    default: () => uuidv4().replace(/-/g, '').substring(0, 10),
    unique: true,
  })
  idUser: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  mfaSecret?: string; // Optional field to store the MFA secret

  @Prop({ required: true, type: String, enum: ['commission', 'administrator'] })
  role: string[];

  @Prop({ default: false })
  isMfaEnabled: boolean; // Track if MFA is enabled
}

export const UserSchema = SchemaFactory.createForClass(User);
