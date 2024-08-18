import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString, IsObject } from 'class-validator';

export class CreateComplaintDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  complainant: string;

  @IsNotEmpty()
  @IsString()
  defendant: string;

  @IsOptional()
  @IsEnum(['open', 'in_progress', 'resolved', 'closed'])
  status: string = 'open';

  @IsOptional()
  @IsDateString()
  dateFiled?: Date;

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, string>;
}
