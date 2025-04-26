import { Controller, Get, Post, Body, Patch, Param, BadRequestException, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { ParkDTO } from './dto/park.dto';
import { ParKSlotDTO } from './dto/parkSlot.dto';
import { ClearSlotDTO } from './dto/clearSlot.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("parking_lot")
  createParkingLot(@Body() body: {no_of_slot : number}){
    if(!body.no_of_slot) throw new BadRequestException("no_of_slot is required");
    return this.appService.createParkingLot(body.no_of_slot);
  }

  @Get("parking_lot_size")
  getParkingLotSize(){
    return this.appService.getParkingLotSize();
  }

  @Patch("parking_lot")
  updateParkingLot(@Body() body: {no_of_slot : number}){
    console.log(body);
    if(!body.no_of_slot) throw new BadRequestException("no_of_slot is required");
    return this.appService.updateParkingLot(body.no_of_slot);
  }

  @Post("park")
  parkCar(@Body(ValidationPipe) body: ParkDTO){
    return this.appService.parkCar(body);
  }

  @Post("park_at_slot")
  parkCarAtSlot(@Body(ValidationPipe) body: ParKSlotDTO){
    console.log(body);
    return this.appService.parkCarAtSlot(body);
  }

  @Get("registration_number/:color")
  getCarsByColor(@Param("color") color: string){
    console.log(color);
    return this.appService.getRegistrationNumberByColor(color);
  }

  @Get("slot_number/:color")
  getSlotsByColor(@Param("color") color: string){
    return this.appService.getSlotsByColor(color);
  }

  @Post("clear")
  clearSlot(@Body(ValidationPipe) body: ClearSlotDTO){
    return this.appService.clearSlot(body);
  }

  @Get("status")
  getStatus(){
    return this.appService.getStatus();
  }

  @Get("empty_slots")
  getAllEmptySlots(){
    return this.appService.getAllEmptySlots();
  }

  @Get("vehicle/:slot_num")
  getCarBySlotNumber(@Param("slot_num", ParseIntPipe) slot_num: number){
    return this.appService.getCarBySlotNumber(slot_num);
  }

  @Get("slot/:car_reg_number")
  getSlotNumberByCarRegNumber(@Param("car_reg_number") car_reg_number: string){
    return this.appService.getSlotNumberByCarRegNumber(car_reg_number);
  }

  @Post("reset")
  resetParkingLot(){
    return this.appService.resetParkingLot();
  }
}
