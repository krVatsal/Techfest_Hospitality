// models/Hostel.js

class Hostel {
    constructor(hostelName, roomNumber, capacity, gender) {
        this.hostelName = hostelName;
        this.roomNumber = roomNumber;
        this.capacity = parseInt(capacity);
        this.gender = gender;
    }
}

export default Hostel
