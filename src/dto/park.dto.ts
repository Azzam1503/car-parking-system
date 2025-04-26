import {IsString, IsNotEmpty} from 'class-validator';

export class ParkDTO{
    @IsString()
    @IsNotEmpty()
    car_reg_number: string;
    
    @IsString()
    @IsNotEmpty()
    car_color: string;
}