import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class ClearSlotDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  slot_number?: number;

  @IsOptional()
  @IsString()
  @Min(4)
  car_reg_number?: string;
}
