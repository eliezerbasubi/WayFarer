import Trip, {
  dbTrip
} from '../models/trip';
import {
  RESOURCE_CONFLICT, CREATED_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE, SUCCESS_CODE
} from '../constants/responseCodes';
import {
  BUS_ALREADY_TAKEN,
  NO_TRIP_AVAILABLE
} from '../constants/feedback';
import Helper from '../helpers/helper';
import { NOT_FOUND, BAD_REQUEST_MSG } from '../constants/responseMessages';

export default class TripController {
  static createTrip(req, res) {
    const tripData = [];
    const { busLicenseNumber, tripDate } = req.body;

    // let trip = [];
    let onSameDate = [];

    // trip = dbTrip.find(item => item.tripId === req.body.trip_id);

    // if (trip) { return Helper.error(res, RESOURCE_CONFLICT, TRIP_ID_EXISTS); }

    onSameDate = dbTrip.find(bus => bus.busLicenseNumber === busLicenseNumber
        && bus.tripDate === tripDate);

    if (onSameDate) { return Helper.error(res, RESOURCE_CONFLICT, BUS_ALREADY_TAKEN); }

    tripData.push(new Trip({
      id: dbTrip.length + 1,
      tripName: req.body.tripName,
      seatingCapacity: req.body.seatingCapacity,
      busLicenseNumber: req.body.busLicenseNumber,
      origin: req.body.origin,
      destination: req.body.destination,
      tripDate: req.body.tripDate,
      time: req.body.time,
      fare: req.body.fare,
      arrivalDate: req.body.arrivalDate,
      status: 'active'
    }));
    dbTrip.push(...tripData);
    return Helper.success(res, CREATED_CODE, ...tripData, 'Trip Created Successfully');
  }

  static cancelTrip(req, res) {
    if (dbTrip.length < 1) { return Helper.error(res, NOT_FOUND_CODE, NOT_FOUND); }

    const queryParams = parseInt(req.params.trip_id, 10);
    const cancelQuest = dbTrip.find(query => query.tripId === queryParams);
    if (cancelQuest) {
      cancelQuest.status = 'cancelled';
      return Helper.success(res, SUCCESS_CODE, cancelQuest, cancelQuest.adminId);
    }

    return Helper.error(res, BAD_REQUEST_CODE, BAD_REQUEST_MSG, 'Trip cancelled successfully');
  }

  static getAllTrips(req, res) {
    if (dbTrip.length < 1) { return Helper.error(res, NOT_FOUND_CODE, NO_TRIP_AVAILABLE); }

    const { origin, destination } = req.query;

    // Filter trips by destination and origin
    if (req.query.origin && req.query.destination) {
      const result = dbTrip.filter(trip => trip.origin.toLowerCase() === origin.toLowerCase()
      && trip.destination.toLowerCase() === destination.toLowerCase());

      if (result.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Origin and Destination Are Not Found'); }
      return Helper.success(res, SUCCESS_CODE, result, `${result.length} result(s) Found`);
    }

    if (destination) {
      // eslint-disable-next-line
      const place = dbTrip.filter(trip => trip.destination.toLowerCase() === destination.toLowerCase());
      if (place.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Destination Not Found'); }
      return Helper.success(res, SUCCESS_CODE, place, `Find ${place.length} result(s) by destination ${destination}`);
    }

    if (origin) {
      const origins = dbTrip.filter(trip => trip.origin.toLowerCase() === origin.toLowerCase());
      if (origins.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Origin Not Found'); }
      return Helper.success(res, SUCCESS_CODE, origins, `Find ${origins.length} result(s) by origin : ${origin}`);
    }

    return Helper.success(res, SUCCESS_CODE, dbTrip, 'Success ! WayFarer Trips !');
  }

  static viewSpecificTrip(req, res) {
    if (dbTrip.length < 1) {
      return Helper.error(res, NOT_FOUND_CODE, 'The Specified Trip was Not Found');
    }

    const questTrip = dbTrip.find(quest => quest.tripId === parseInt(req.params.trip_id, 10));
    return Helper.success(res, SUCCESS_CODE, questTrip, 'Trip Successfully Found');
  }
}
