import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Complaint, ComplaintDocument } from './entities/complaint.entity';
import { Model } from 'mongoose';
import { Evidence, EvidenceDocument } from './entities/evidence.entity';
import { CreateEvidenceDto } from './dto/create-evidence.dto';

@Injectable()
export class ComplaintService {
  logger = new Logger('ComplaintService');

  constructor(
    @InjectModel('Complaint') private complaintModel: Model<ComplaintDocument>,
    @InjectModel('Evidence') private evidenceModel: Model<EvidenceDocument>,
  ) {}

  async create(createComplaintDto: CreateComplaintDto) {
    try {
      this.logger.log('Creating new register');
      const newComplaint = new this.complaintModel(createComplaintDto);
      const savedComplaint = await newComplaint.save();
      return { idComplaint: savedComplaint.idComplaint, passComplaint: savedComplaint.passComplaint };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating complaint');
    }
  }

  async createEvidence(createEvidence: CreateEvidenceDto) {
    try {
      this.logger.log('Creating new evidence');
      const newEvidence = new this.evidenceModel(createEvidence);
      const savedEvidence = await newEvidence.save();
      return { idEvidence: savedEvidence.idEvidence };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating evidence');
    }
  }

  async findAll(): Promise<Complaint[]> {
    this.logger.log('Finding all complaints');
    const complaints = await this.complaintModel.find().exec();
    if (!complaints) {
      throw new InternalServerErrorException('Failed to retrieve complaints');
    }
    return complaints;
  }

  async findAllEvidences(): Promise<Evidence[]> {
    this.logger.log('Finding all evidences');
    const evidences = await this.evidenceModel.find().exec();
    if (!evidences) {
      throw new InternalServerErrorException('Failed to retrieve evidences');
    }
    return evidences;
  }

  async findOneEvidence(id: string): Promise<Evidence> {
    this.logger.log(`Finding evidence with id ${id}`);
    const evidence = await this.evidenceModel.findOne({ idEvidence: id }).exec();
    if (!evidence) {
      throw new NotFoundException(`Evidence with id ${id} not found`);
    }
    return evidence;
  }

  async findOne(id: string): Promise<Complaint> {
    this.logger.log(`Finding complaint with id ${id}`);
    const complaint = await this.complaintModel.findOne({ idComplaint: id, isDeleted: false }).exec();
    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${id} not found`);
    }
    return complaint;
  }

  async update(id: string, updateComplaintDto: UpdateComplaintDto) {
    this.logger.log(`Updating complaint with id ${id}`);
    const updatedComplaint = await this.complaintModel
      .findOneAndUpdate(
        { idComplaint: id, isDeleted: false }, // Find the document by idComplaint
        updateComplaintDto, // Apply the updates
        { new: true }, // Return the updated document
      )
      .select('idComplaint'); // Select only the idComplaint field
    if (!updatedComplaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return updatedComplaint;
  }

  async remove(id: string) {
    this.logger.log(`Deleting complaint with id ${id}`);
    const complaint = await this.complaintModel.findOneAndUpdate(
      { idComplaint: id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true },
    );
    if (!complaint) {
      this.logger.warn(`Complaint with ID ${id} not found`);
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return complaint;
  }

  async validateComplaintPass(idComplaint: string, passComplaint: string): Promise<boolean> {
    const complaint = await this.findOne(idComplaint);

    if (!complaint) {
      throw new NotFoundException(`Complaint with id ${idComplaint} not found`);
    }

    return complaint.passComplaint === passComplaint;
  }

}
