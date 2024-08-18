import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateEvidenceDto {

  @IsString()
  @IsNotEmpty()
  idFile: string;

  @IsString()
  @IsNotEmpty()
  idComplaint: string;

  @IsString()
  @IsOptional()
  description?: string;
}
