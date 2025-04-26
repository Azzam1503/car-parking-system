import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ParKSlotDTO } from './dto/parkSlot.dto';
import { ParkDTO } from './dto/park.dto';
import { ClearSlotDTO } from './dto/clearSlot.dto';

@Injectable()
export class AppService {
  private slots: (
    {
      car_reg_number: string;
      car_color: string;
    } | null
  )[];
  
  private totalSize: number;
  private size: number;
  getHello(): string {
    return 'Hello World!';
  }

  private checkSlotsInitialized() {
    if (!this.slots || this.slots.length === 0) {
      throw new BadRequestException("Slots not initialized. Create slots first.");
    }
  }

  private checkIfCarAlreadyParked(car_reg_number: string){
    this.checkSlotsInitialized();
    for(let i =0; i<this.slots.length; i++){
      if (this.slots[i] !== null && this.slots[i]!.car_reg_number === car_reg_number) {
        return {...this.slots[i], slot_number: i + 1};
      }
    }
    return undefined;
  }

  createParkingLot(no_of_slot: number) {
    try {
      this.slots = new Array(no_of_slot).fill(null);
      this.totalSize = no_of_slot;
      this.size = 0;
      return {success: true, slots: no_of_slot, status: "created"};
    } catch (error) {
      throw new InternalServerErrorException("Error creating parking lot: " + error.message);
    }
  };

  updateParkingLot(no_of_slot: number){
    try {
      this.checkSlotsInitialized();
      this.totalSize = this.totalSize + no_of_slot;
      let oldSlots = this.slots;
      this.slots = new Array(this.totalSize).fill(null);
      for(let i =0; i<oldSlots.length; i++){
        this.slots[i] = oldSlots[i];
      }
      return {success: true, slots: this.totalSize, status: "updated slots"};
    } catch (error) {
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("Error updating parking lot: " + error.message);
    }
  }

  getParkingLotSize(){
    try{
      this.checkSlotsInitialized();
      return {total_slots: this.totalSize, slots_occupied: this.size, slots_empty: this.totalSize - this.size};
    }catch(error){
      if(error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException("Error getting parking lot size: " + error.message);
    }
  };

  parkCar(body: ParkDTO){
    try {
      const { car_reg_number, car_color } = body;
      this.checkSlotsInitialized();
      if(this.size == this.totalSize) throw new ConflictException("parking lot is full");
      if(this.checkIfCarAlreadyParked(car_reg_number) !== undefined) throw new ConflictException("car already parked");
      const emptyIndex = this.slots.findIndex((slot) => slot === null);
      if(emptyIndex === -1) {
        throw new InternalServerErrorException("No empty slot found despite size check");
      }
     
      this.slots[emptyIndex] = {car_reg_number: car_reg_number, car_color: car_color};
      this.size = this.size + 1;

      return {success: true, slot_number: emptyIndex+1, status: "parked"};
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error parking car: " + error.message);
    }
  };

  parkCarAtSlot(body: ParKSlotDTO){
    const { car_reg_number, car_color, slot_number } = body;
    try {
      this.checkSlotsInitialized();
      if(this.checkIfCarAlreadyParked(car_reg_number) !== undefined) throw new ConflictException("car already parked");
      if(this.size == this.totalSize) throw new ConflictException("parking lot is full");
      if(slot_number > this.totalSize) throw new ConflictException("slot number out of range");

      if(this.slots[slot_number - 1] !== null) throw new ConflictException("slot already occupied");
      
      this.slots[slot_number - 1] = {car_reg_number: car_reg_number, car_color: car_color};
      this.size = this.size + 1;
      return {success: true, slot_number: slot_number, status: "parked"};
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error parking car: " + error.message);
    }
  }
  
  getStatus(){
    try {
      this.checkSlotsInitialized();
      const result = this.slots.map((slot, index) => slot === null ? {slot_number: index+1, message:"empty slot"} : {slot_number: index+1, car_reg_number: slot.car_reg_number, car_color: slot.car_color});
      return {success:true, result};
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }
  }

  getRegistrationNumberByColor(color: string){
    try {
      this.checkSlotsInitialized();
      if(!color) throw new BadRequestException("color is required");
      let result = this.slots.filter((slot): slot is { car_reg_number: string; car_color: string } =>
        slot !== null && slot.car_color === color
      );
      return result;
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }
  }

  getSlotsByColor(color: string){
    try {
      this.checkSlotsInitialized();
    // const result: any = [];
    // for (let i = 0; i < this.slots.length; i++) {
    //   const slot = this.slots[i];
    //   if (slot && slot.car_color === color) {
    //     result.push({
    //       slot_number: i + 1,
    //       car_reg_number: slot.car_reg_number,
    //       car_color: slot.car_color, 
    //     });
    //   }
    // }
    
    const result = this.slots.map((slot, index) => {
      return slot !== null ? slot.car_color === color ? {slot_number: index + 1, car_reg_number: slot.car_reg_number, car_color: slot.car_color} : null : null;
    }).filter((slot) => slot !== null);
    return {sucess: true, result};
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }
  }

  clearSlot(body: ClearSlotDTO){
    
    try {
      const { slot_number, car_reg_number } = body;
      if(!slot_number  && !car_reg_number) throw new BadRequestException("slot_number or car_reg_number is required");
      this.checkSlotsInitialized();
      
      if(slot_number){
        if(slot_number > this.totalSize) throw new ConflictException("slot number out of range");
        if(this.slots[slot_number - 1] === null) throw new ConflictException("slot already is empty");

        this.slots[slot_number - 1] = null;
        this.size = this.size - 1;
        return {success: true, slot_number: slot_number, status: "cleared"};
      }else if(car_reg_number){
        const slot = this.checkIfCarAlreadyParked(car_reg_number);
        console.log(slot);
        if (slot === undefined) throw new ConflictException("car not found");
        let index = slot.slot_number - 1;
        this.slots[index] = null;
        this.size = this.size - 1; 
        return {success: true, slot_number: index + 1, status: "cleared"};
      }
      
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }
  }


  getCarBySlotNumber(slot_number: number){
    try {
      this.checkSlotsInitialized();
      if(slot_number < 1 || slot_number > this.totalSize) throw new BadRequestException("slot number out of range");
      let slot = this.slots[slot_number-1];
      if(slot === null) throw new ConflictException("slot is empty");
      return {sucess: true, slot_number:slot_number+1, car_reg_number: slot.car_reg_number, car_color: slot.car_color};
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }
  }


  getSlotNumberByCarRegNumber(car_reg_number: string){
    try {
      this.checkSlotsInitialized();
      let slot = this.slots.find((slot, index) => slot !== null && slot.car_reg_number === car_reg_number);
      if(slot === null || slot === undefined) throw new ConflictException("car not found");
      return {slot_number: this.slots.indexOf(slot) + 1, car_reg_number: slot.car_reg_number, car_color: slot.car_color};
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }    
  }


  getAllEmptySlots(){
    this.checkSlotsInitialized();
    try {
      let emptySlots = this.slots.map((slot, index) => slot !== null ? {slot_number: index + 1, car_reg_number: slot.car_reg_number, isEmpty: false} : {slot_number: index + 1, isEmpty: true}) 
      .filter((slot) => slot.isEmpty).map((slot) => slot.slot_number);
      return emptySlots;
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }
  }

  resetParkingLot(){
    try {
      this.slots = [];
      this.size = 0;
      this.totalSize = 0;
      return {success: true, status: "reset", size: this.size};
    } catch (error) {
      if(error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Error  getting status: " + error.message);
    }
  }
}
