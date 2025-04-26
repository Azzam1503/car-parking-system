import { ParkDTO } from "./park.dto";
import { IsNumber, IsNotEmpty, Min } from "class-validator";
export class ParKSlotDTO extends ParkDTO {
    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    slot_number: number;
}