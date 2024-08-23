import { IsString, IsBoolean, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDynamicFieldDto {
  @ApiProperty({
    description: 'Name of the dynamic field',
    example: 'anonymousComplaint',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Label of the dynamic field',
    example: 'Anonymous Complaint',
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Type of the dynamic field',
    example: 'boolean',
    enum: ['boolean', 'text', 'email', 'text-area', 'array-text', 'date'],
  })
  @IsString()
  @IsIn(['boolean', 'text', 'email', 'text-area', 'array-text', 'date'])
  type: string;

  @ApiProperty({
    description: 'Visibility status of the dynamic field',
    example: true,
  })
  @IsBoolean()
  visible: boolean;

  @ApiProperty({
    description: 'Default value of the dynamic field',
    example: true,
  })
  @IsBoolean()
  default: boolean;
}
