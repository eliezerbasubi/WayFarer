import Trip, {
  dbTrip
} from '../models/trip';
import {
  RESOURCE_CONFLICT, CREATED_CODE
} from '../constants/responseCodes';
import {
  TRIP_ID_EXISTS,
  BUS_ALREADY_TAKEN
} from '../constants/feedback';
import Helper from '../helpers/helper';

export default class TripController {
  static createTrip(req, res) {
    const tripData = [];
    const busLicense = req.headers.bus_license_number;
    const goingDay = req.headers.trip_date;

    let trip = [];
    let onSameDate = [];

    trip = dbTrip.find(item => item.tripId === req.headers.trip_id);

    if (trip) { return Helper.error(res, RESOURCE_CONFLICT, TRIP_ID_EXISTS); }

    onSameDate = dbTrip.find(bus => bus.busLicenseNumber === busLicense
        && bus.tripDate === goingDay);

    if (onSameDate) { return Helper.error(res, RESOURCE_CONFLICT, BUS_ALREADY_TAKEN); }

    tripData.push(new Trip({
      id: req.headers.trip_id,
      tripName: req.headers.trip_name,
      seatingCapacity: req.headers.seating_capacity,
      busLicenseNumber: req.headers.bus_license_number,
      origin: req.headers.trip_origin,
      destination: req.headers.destination,
      tripDate: req.headers.trip_date,
      time: req.headers.time,
      fare: req.headers.fare,
      arrivalDate: req.headers.arrival_date,
      status: 'active'
    }));

    dbTrip.push(...tripData);
    return Helper.success(res, CREATED_CODE, ...tripData, 'Trip Created Successfully');
  }
}
