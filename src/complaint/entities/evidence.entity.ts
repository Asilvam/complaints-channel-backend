import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type EvidenceDocument = Evidence & Document;

@Schema({ collection: 'evidences', timestamps: true })
export class Evidence {
  @Prop({
    required: true,
    default: () => uuidv4().replace(/-/g, '').substring(0, 10),
    unique: true,
  })
  idEvidence: string;

  @Prop({ required: true })
  idFile: string;

  @Prop({ required: true })
  idComplaint: string;

  @Prop()
  description?: string;
}

export const EvidenceSchema = SchemaFactory.createForClass(Evidence);
