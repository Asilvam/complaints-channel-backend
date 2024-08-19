import { Module } from '@nestjs/common';
import { DynamicFieldService } from './dynamic-field.service';
import { DynamicFieldController } from './dynamic-field.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicField, DynamicFieldSchema } from './entities/dynamic-field.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: DynamicField.name, schema: DynamicFieldSchema }])],
  controllers: [DynamicFieldController],
  providers: [DynamicFieldService],
})
export class DynamicFieldModule {}
