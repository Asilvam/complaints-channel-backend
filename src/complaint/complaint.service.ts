import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint, ComplaintDocument } from './entities/complaint.entity';
import { Model } from 'mongoose';
import { EvidenceDocument } from './entities/evidence.entity';
import { CreateEvidenceDto } from './dto/create-evidence.dto';

@Injectable()
export class ComplaintService {
  logger = new Logger('ComplaintService');

  constructor(
    @InjectModel('Complaint') private complaintModel: Model<ComplaintDocument>,
    @InjectModel('Evidence') private evidenceModel: Model<EvidenceDocument>,
  ) {}

  create(createComplaintDto: CreateComplaintDto) {
    try {
      this.logger.log('Creating new register');
      const newComplaint = new this.complaintModel(createComplaintDto);
      return newComplaint.save();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating complaint');
    }
  }

  createEvidence(createEvidence: CreateEvidenceDto) {
    try {
      this.logger.log('Creating new evidence');
      const newEvidence = new this.evidenceModel(createEvidence);
      return newEvidence.save();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating evidence');
    }
  }

  async findAll(): Promise<Complaint[]> {
    this.logger.log('Finding all registers');
    try {
      const complaints = await this.complaintModel.find().exec();
      return complaints;
    } catch (error) {
      this.logger.error('Failed to find all registers', error.stack);
      throw new InternalServerErrorException('Failed to retrieve complaints');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} complaint`;
  }

  update(id: number, updateComplaintDto: UpdateComplaintDto) {
    return `This action updates a #${id} complaint`;
  }

  remove(id: number) {
    return `This action removes a #${id} complaint`;
  }
}
