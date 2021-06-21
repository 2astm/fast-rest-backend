import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInByUniqueCodeDto {
  @IsString()
  @IsUUID()
  @ApiProperty({ type: 'string', format: 'uuid' })
  uniqueCode: string;
}