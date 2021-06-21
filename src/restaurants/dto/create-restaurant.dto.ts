import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  address: string;

  @IsLatitude()
  @ApiProperty({ minimum: -90, maximum: 90 })
  lat: number;

  @IsLongitude()
  @ApiProperty({ minimum: -180, maximum: 180 })
  lng: number;
}
