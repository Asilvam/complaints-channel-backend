import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComplaintDto {
  @ApiProperty({
    description: 'Title of the complaint',
    example: 'Harassment in the workplace',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the complaint',
    example: 'The complainant was harassed by the defendant in the office.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'name of the complainant',
    example: 'Benita Ruiz',
  })
  @IsNotEmpty()
  @IsString()
  complainant: string;

  @ApiProperty({
    description: 'name of the defendant',
    example: 'Ronald Perez',
  })
  @IsNotEmpty()
  @IsString()
  defendant: string;

  @ApiProperty({
    description: 'Current status of the complaint',
    example: 'open',
    enum: ['open', 'in_progress', 'resolved', 'closed'],
  })
  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status: string = 'open';

  @ApiProperty({
    description: 'Date when the complaint was filed',
    example: '2023-08-18T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dateFiled?: Date;

  @ApiProperty({
    description: 'Resolution details, if available',
    example: 'The case has been resolved amicably.',
  })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiProperty({
    description: 'ID of the person assigned to the case',
    example: 'Juan Perez',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: 'Additional metadata associated with the complaint',
    example: { priority: 'high', sensitive: 'true' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
