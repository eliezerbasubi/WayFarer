export const dbTrip = [];
export default class Trip {
  constructor({
    id,
    tripName,
    seatingCapacity,
    busLicenseNumber,
    origin,
    destination,
    tripDate,
    time,
    fare,
    arrivalDate,
    status,
    message
  }) {
    this.message = message;
    this.tripId = id;
    this.tripName = tripName;
    this.seatingCapacity = seatingCapacity;
    this.busLicenseNumber = busLicenseNumber;
    this.origin = origin;
    this.destination = destination;
    this.tripDate = tripDate;
    this.time = time;
    this.arrivalDate = arrivalDate;
    this.fare = fare;
    this.status = status;
  }
}
