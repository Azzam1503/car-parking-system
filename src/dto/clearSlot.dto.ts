import { IsOptional, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class ClearSlotDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  slot_number?: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  car_reg_number?: string;
}
