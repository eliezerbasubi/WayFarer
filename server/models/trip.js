export const dbTrip = [];
export default class Trip {
  constructor({
    id,
    trip_name,
    seating_capacity,
    bus_license_number,
    origin,
    destination,
    trip_date,
    time,
    fare,
    arrival_date,
    status
  }) {
    this.trip_id = id;
    this.trip_name = trip_name;
    this.seating_capacity = seating_capacity;
    this.bus_license_number = bus_license_number;
    this.origin = origin;
    this.destination = destination;
    this.trip_date = trip_date;
    this.time = time;
    this.arrival_date = arrival_date;
    this.fare = fare;
    this.status = status;
  }
}
