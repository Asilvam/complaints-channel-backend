import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDynamicFieldDto } from './dto/create-dynamic-field.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DynamicField, DynamicFieldDocument } from './entities/dynamic-field.entity';

@Injectable()
export class DynamicFieldService {
  logger = new Logger('DynamicFieldService');

  constructor(@InjectModel('DynamicField') private dynamicFieldModel: Model<DynamicFieldDocument>) {}

  async create(createDynamicFieldDto: CreateDynamicFieldDto) {
    try {
      this.logger.log('Creating new dynamic field');
      const newDynamicField = new this.dynamicFieldModel(createDynamicFieldDto);
      const savedDynamicField = await newDynamicField.save();
      return { idDynamicField: savedDynamicField.idDynamicField };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating dynamic field');
    }
  }

  async findAll(): Promise<DynamicField[]> {
    this.logger.log('Finding all dynamics fields');
    const dynamicsFields = await this.dynamicFieldModel.find().exec();
    if (!dynamicsFields) {
      throw new InternalServerErrorException('Failed to retrieve dynamics Fields');
    }
    return dynamicsFields;
  }

  async findOne(idDynamicField: string): Promise<DynamicField> {
    const dynamicsField = await this.dynamicFieldModel.findOne({ idDynamicField }).exec();
    if (!dynamicsField) {
      throw new NotFoundException(`Complaint with id ${idDynamicField} not found`);
    }
    return dynamicsField;
  }

  async remove(id: string) {
    const deletedComplaint = await this.dynamicFieldModel.findOneAndDelete({
      idDynamicField: id,
    });
    if (!deletedComplaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return { message: `Complaint with ID ${id} has been removed` };
  }
}
