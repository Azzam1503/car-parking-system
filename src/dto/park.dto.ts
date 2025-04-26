import {IsString, IsNotEmpty, Min} from 'class-validator';

export class ParkDTO{
    @IsString()
    @IsNotEmpty()
    @Min(4)
    car_reg_number: string;
    
    @IsString()
    @IsNotEmpty()
    car_color: string;
}