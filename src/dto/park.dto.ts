import {IsString, IsNotEmpty, MinLength} from 'class-validator';

export class ParkDTO{
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    car_reg_number: string;
    
    @IsString()
    @IsNotEmpty()
    car_color: string;
}