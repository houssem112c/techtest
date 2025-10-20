import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'oldPassword123',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'newPassword123',
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
