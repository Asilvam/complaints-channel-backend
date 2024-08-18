import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateDynamicFieldDto } from './dto/create-dynamic-field.dto';
import { UpdateDynamicFieldDto } from './dto/update-dynamic-field.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DynamicField, DynamicFieldDocument } from "./entities/dynamic-field.entity";

@Injectable()
export class DynamicFieldService {
  logger = new Logger('DynamicFieldService');

  constructor(
    @InjectModel('DynamicField') private dynamicFieldModel: Model<DynamicFieldDocument>,
  ) {}

  create(createDynamicFieldDto: CreateDynamicFieldDto) {
    try {
      this.logger.log('Creating new dynamic field');
      const newDynamicField = new this.dynamicFieldModel(createDynamicFieldDto);
      return newDynamicField.save();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error creating dynamic field');
    }
  }

  async findAll() {
    this.logger.log('Finding all registers');
    try {
      const dynamicsFields = await this.dynamicFieldModel.find().exec();
      return dynamicsFields;
    } catch (error) {
      this.logger.error('Failed to find all dynamics fields', error.stack);
      throw new InternalServerErrorException('Failed to retrieve dynamics fields');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} dynamicField`;
  }

  update(id: number, updateDynamicFieldDto: UpdateDynamicFieldDto) {
    return `This action updates a #${id} dynamicField`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicField`;
  }
}
