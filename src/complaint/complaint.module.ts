import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Complaint, ComplaintSchema } from "./entities/complaint.entity";
import { Evidence, EvidenceSchema } from "./entities/evidence.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintSchema },
      { name: Evidence.name, schema: EvidenceSchema },
    ]),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
