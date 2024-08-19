import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ComplaintDocument = Complaint & Document;

@Schema({ collection: 'complaints', timestamps: true })
export class Complaint {
  @Prop({
    required: true,
    default: () => uuidv4().replace(/-/g, '').substring(0, 10),
    unique: true,
  })
  idComplaint: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  complainant: string;

  @Prop({ required: true })
  defendant: string;

  @Prop({ required: true, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' })
  status: string;

  @Prop({ type: Date, default: Date.now })
  dateFiled: Date;

  @Prop()
  resolution?: string;

  @Prop()
  assignedTo?: string;

  @Prop({ type: Map, of: String })
  metadata?: Map<string, string>;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const ComplaintSchema = SchemaFactory.createForClass(Complaint);
