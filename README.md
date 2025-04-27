# Car Parking System API Documentation

This is a car parking system built with **NestJS**, which allows you to manage parking slots and park cars. The system provides multiple endpoints for operations such as creating a parking lot, parking cars, clearing slots, and checking slot statuses.

## Endpoints

### 1. `POST /parking_lot`
Create a parking lot with a given number of slots.

#### Payload:
```json
{
  "no_of_slot": 2
}
```
#### Response 
```json
{
  "success": true,
  "slots": 2,
  "status": "created"
}
```

### 2. `PATCH /parking_lot`
Create a parking lot with a given number of slots.

After creating the parking lot size can be increased from this endpoint 
#### Payload:
```json
{
  "no_of_slot": 2
}
```
#### Response 
```json
{
  "success": true,
  "slots": 4,
  "status": "created"
}
```

### 3. `GET /parking_lot_size`
Create a parking lot with a given number of slots.

#### Response 
```json
{
  "total_slots": 4,
  "slots_occupied": 0,
  "slots_empty": 4
}
```


### 4. `POST /park`
Park the car at a empty slot.

After creating the parking lot size can be increased from this endpoint 
#### Payload:
```json
{
  "car_reg_number": "1234",
  "car_color": "red"
}
```
#### Response 
```json
{
  "success": true,
  "slot_number": 1,
  "status": "parked"
}
```

### 5. `POST /park_at_slot`
Park the car at a particular if slot is in range and empty.

#### Payload:
```json
{
  "car_reg_number": "1234",
  "car_color": "red",
  "slot_number": 4
}
```

#### Response 
```json
{
  "success": true,
  "slot_number": 4,
  "status": "parked"
}
```

### 6. `GET /registration_number/:color`
Get all car registration numbers by car color.

#### Path Parameter:
- **color** (string): The color of the car.

#### Response:
```json
[
  {
    "car_reg_number": "1234",
    "car_color": "red"
  },
  {
    "car_reg_number": "5678",
    "car_color": "red"
  }
]
```

### 7. `Get/slot_number/:color`
Get all slot numbers by car color.

#### Path Parameter:
- **color** (string): The color of the car.

#### Response:
```json
[
  { 
    "slot_number": 1,
    "car_reg_number": "1234",
    "car_color": "red"
  },
  {
    "slot_number": 2,
    "car_reg_number": "5678",
    "car_color": "red"
  }
]
```
### 8. `POST /clear`
Clear a parking slot by either slot number or car registration number.

#### Request Body:
- **slot_number** (integer, optional): The slot number to clear.
- **car_reg_number** (string, optional): The car registration number to clear.

At least one of `slot_number` or `car_reg_number` must be provided.

#### Example Request Body:
```json
{
  "slot_number": 2
}
```
or 
```json
{
  "car_reg_number": "ABC1234"
}
```
#### Response:
```json
{
  "success": true,
  "slot_number": 2,
  "status": "cleared"
}
```

### 9. `GET /status`
Get the status of all parking slots, including information on whether the slot is empty or occupied.

#### Response:
```json
{
  "success": true,
  "result": [
    {
      "slot_number": 1,
      "message": "empty slot"
    },
    {
      "slot_number": 2,
      "car_reg_number": "1234",
      "car_color": "red"
    },
    {
      "slot_number": 3,
      "message": "empty slot"
    }
  ]
}
```

### 10. `GET /empty_slots`
Get a list of all the empty parking slots.

#### Response:
```json
{
  "success": true,
  "result": [1, 3]
}
```

### 11. `GET /empty_slots`
Get a list of all the occupied parking slots.

#### Response:
```json
{
  "success": true,
  "result": [2, 4]
}
```

### 12. `GET /vehicle/:slot_num`
Get the details of the vehicle parked in a specific slot.

#### Parameters:
- **slot_num** (integer): The slot number to retrieve the parked vehicle's details.

#### Response:
```json
{
  "success": true,
  "slot_number": 1,
  "car_reg_number": "1234",
  "car_color": "red"
}
```

### 13. `GET /slot/:car_reg_number`
Get the slot number of a vehicle by its registration number.

#### Parameters:
- **car_reg_number** (string): The registration number of the vehicle.

#### Response:
```json
{
  "slot_number": 1,
  "car_reg_number": "1234",
  "car_color": "red"
}
```
### 14. `POST /reset`
Reset the parking lot, clearing all parked cars and resetting the lot size to zero.

#### Response:
```json
{
  "success": true,
  "status": "reset",
  "size": 0
}
```

## Payload Validation

DTOs (`ParkDTO`, `ParKSlotDTO`, `ClearSlotDTO`) and the `ValidationPipe` are used to ensure correct payload formats.

### HTTP Errors:
- **400 (Bad Request)**: Thrown when the provided payload is invalid or missing required fields.
- **409 (Conflict)**: Thrown when there is a conflict, such as trying to park a car that's already parked.
- **500 (Internal Server Error)**: Thrown when there is an unexpected error during the operation.

### Notes:
- All slots are **1-indexed**, meaning the first slot is slot 1, the second is slot 2, and so on.
- **Car registration numbers are unique** across the parking lot. No two cars can have the same registration number in the same lot.