export const dbBookings = [];
export const cacheBookings = [];
export default class Booking {
  constructor({
    bookingId,
    busLicenseNumber,
    tripId,
    tripDate,
    tripTime,
    tripName,
    fare,
    userId,
    firstName,
    lastName,
    email,
    seatNumber,
    createdOn,
    status,
    message
  }) {
    this.message = message;
    this.userId = userId;
    this.bookingID = bookingId;
    this.tripId = tripId;
    this.tripName = tripName;
    this.tripDate = tripDate;
    this.time = tripTime;
    this.fare = fare;
    this.busLicenseNumber = busLicenseNumber;
    this.seatNumber = seatNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdOn = createdOn;
    this.status = status; // Invalid or valid. Default is valid
  }
}
