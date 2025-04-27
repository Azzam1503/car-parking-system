import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(service.getHello()).toBe('Hello World!');
    });
  });

  describe('createParkingLot', () => {
    it('should create parking lot with given number of slots', () => {
      const result = service.createParkingLot(5);
      expect(result).toEqual({ success:true, slots: 5, status: 'created' });
    });
  });

  describe('updateParkingLot', () => {
    it('should update parking lot with new slots', () => {
      service.createParkingLot(5);
      const result = service.updateParkingLot(3);
      expect(result).toEqual({ success: true, slots: 8, status: 'updated slots' });
    });

    it('should throw BadRequestException if parking lot not initialized', () => {
      expect(() => service.updateParkingLot(3)).toThrow(BadRequestException);
    });
  });

  describe('getParkingLotSize', () => {
    it('should return parking lot size', () => {
      service.createParkingLot(4);
      const result = service.getParkingLotSize();
      expect(result).toEqual({ total_slots: 4, slots_occupied: 0, slots_empty: 4 });
    });

    it('should throw BadRequestException if parking lot not initialized', () => {
        expect(() => service.getParkingLotSize()).toThrow(BadRequestException);
    });
  });

  describe('parkCar', () => {
    it('should park a car in the next available slot', () => {
      service.createParkingLot(2);
      const result = service.parkCar({ car_reg_number: '1234', car_color: 'red' });
      expect(result).toEqual({ success: true, slot_number: 1, status: 'parked' });
    });

    it('should not allow duplicate parking', () => {
      service.createParkingLot(2);
      service.parkCar({ car_reg_number: '1234', car_color: 'red' });
      expect(() => service.parkCar({ car_reg_number: '1234', car_color: 'blue' }))
        .toThrow(ConflictException);
    });

    it('should not park if parking is full', () => {
      service.createParkingLot(1);
      service.parkCar({ car_reg_number: '1234', car_color: 'red' });
      expect(() => service.parkCar({ car_reg_number: '5678', car_color: 'blue' }))
        .toThrow(ConflictException);
    });

    it("should not park if car is already parked",()=> {
        service.createParkingLot(2);
        service.parkCar({ car_reg_number: '1234', car_color: 'red' });
        expect(() => service.parkCar({ car_reg_number: '1234', car_color: 'blue' })).toThrow(ConflictException);
    });
  });

  describe('parkCarAtSlot', () => {
    it('should park car at given slot', () => {
      service.createParkingLot(3);
      const result = service.parkCarAtSlot({ car_reg_number: '5678', car_color: 'blue', slot_number: 2 });
      expect(result).toEqual({ success: true, slot_number: 2, status: 'parked' });
    });

    it('should throw ConflictException if slot is already occupied', () => {
      service.createParkingLot(3);
      service.parkCarAtSlot({ car_reg_number: '5678', car_color: 'blue', slot_number: 2 });
      expect(() => service.parkCarAtSlot({ car_reg_number: '9999', car_color: 'red', slot_number: 2 }))
        .toThrow(ConflictException);
    });
  });

  describe('getStatus', () => {
    it('should return current parking slots', () => {
      service.createParkingLot(2);
      expect(service.getStatus().result.length).toBe(2);
    });
  });

  describe('getRegistrationNumberByColor', () => {
    it('should return cars by color', () => {
      service.createParkingLot(2);
      service.parkCar({ car_reg_number: '1234', car_color: 'red' });
      service.parkCar({ car_reg_number: '1324', car_color: 'black' });
      const result = service.getRegistrationNumberByColor('red');
      expect(result.result.length).toBe(1);
      expect(result.result[0].car_color).toBe('red');
    });
  });

  describe('getSlotsByColor', () => {
    it('should return slots matching car color', () => {
      service.createParkingLot(3);
      service.parkCar({ car_reg_number: '5678', car_color: 'blue' });
      service.parkCar({ car_reg_number: '5679', car_color: 'red' });
      service.parkCar({ car_reg_number: '5688', car_color: 'blue' });
      const result = service.getSlotsByColor('blue');
      expect(result.result.length).toBe(2);
    });
  });


  describe('clearSlot', () => {
    it('should clear a slot by slot number', () => {
      service.createParkingLot(2);
      service.parkCarAtSlot({slot_number: 1, car_reg_number: '5678', car_color: 'blue' });
      const clearResult = service.clearSlot({ slot_number: 1 });
      expect(clearResult).toEqual({ success: true, slot_number: 1, status: 'cleared' });
    });

    it('should clear a slot by car registration number', () => {
      service.createParkingLot(2);
      service.parkCar({ car_reg_number: '1234', car_color: 'red' });
      
      const clearResult = service.clearSlot({ car_reg_number: '1234' });
      if (clearResult) {
        expect(clearResult.status).toBe('cleared');
      }
    });
  });


  describe('getCarBySlotNumber', () => {
    it('should get car by slot number', () => {
      service.createParkingLot(2);
      service.parkCarAtSlot({slot_number: 2, car_reg_number: '8888', car_color: 'black' });
      const result = service.getCarBySlotNumber(2);
      expect(result.car_reg_number).toBe('8888');
    });

    it('should throw ConflictException if no car parked', () => {
        service.createParkingLot(1);
        expect(() => service.getCarBySlotNumber(1)).toThrow(ConflictException);
      });
  });

  describe('getSlotNumberByCarRegNumber', () => {
    it('should get slot number by car registration number', () => {
      service.createParkingLot(2);
      service.parkCar({ car_reg_number: '7777', car_color: 'green' });
      const result = service.getSlotNumberByCarRegNumber('7777');
      expect(result.slot_number).toBe(1);
    });
  });

  describe('getAllEmptySlots', () => {
    it('should return all empty slots', () => {
      service.createParkingLot(5);
      service.parkCar({ car_reg_number: '9999', car_color: 'red' });
      service.parkCar({ car_reg_number: '9991', car_color: 'black' });
      const emptySlots = service.getAllEmptySlots();
      expect(emptySlots.length).toBe(3);
    });
  });

  describe('getAllOccupiedSlots', () => {
    it("should return all occupied slots", () =>{
        service.createParkingLot(5);
        service.parkCarAtSlot({slot_number: 1,  car_reg_number: '9999', car_color: 'red' });
        service.parkCarAtSlot({slot_number: 4,  car_reg_number: '9991', car_color: 'red' });
        service.parkCarAtSlot({slot_number: 5,  car_reg_number: '1991', car_color: 'black' });
        expect(service.getAllOccupiedSlots().length).toBe(3);
    })
  })

  describe('resetParkingLot', () => {
    it('should reset the parking lot', () => {
      service.createParkingLot(2);
      const result = service.resetParkingLot();
      expect(result.success).toBe(true);
      expect(result.size).toBe(0);
    });
  });
});
