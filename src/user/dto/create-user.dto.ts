import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user, used for login and notifications.',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Secure password for the user account.',
    example: 'strongPassword123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: 'Optional MFA secret for enabling two-factor authentication using apps like Google Authenticator.',
    example: 'JBSWY3DPEHPK3PXP',
  })
  @IsOptional()
  @IsString()
  mfaSecret?: string;

  @ApiProperty({
    description: 'Role of the user in the system, defining their permissions.',
    example: ['administrator'],
    enum: ['commission', 'administrator'],
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1) // Ensure at least one role is provided
  @ArrayMaxSize(2) // Optional: Limit to a maximum number of roles
  @IsEnum(['commission', 'administrator'], { each: true })
  role: string[];

  @ApiPropertyOptional({
    description: 'Indicates whether multi-factor authentication (MFA) is enabled for the user.',
    example: false,
  })
  @IsOptional()
  isMfaEnabled: boolean = false;
}
