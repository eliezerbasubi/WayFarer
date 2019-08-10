import Trip, {
  dbTrip
} from '../models/trip';
import {
  RESOURCE_CONFLICT, CREATED_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE, SUCCESS_CODE
} from '../constants/responseCodes';
import {
  BUS_ALREADY_TAKEN,
  NO_TRIP_AVAILABLE,
  ID_NOT_FOUND
} from '../constants/feedback';
import Helper from '../helpers/helper';

export default class TripController {
  static createTrip(req, res) {
    const tripData = [];
    const { bus_license_number, trip_date } = req.body;
    let onSameDate = [];

    onSameDate = dbTrip.find(bus => bus.bus_license_number === bus_license_number
        && bus.trip_date === trip_date);


    if (onSameDate) { return Helper.error(res, RESOURCE_CONFLICT, BUS_ALREADY_TAKEN); }

    tripData.push(new Trip({
      id: dbTrip.length + 1,
      trip_name: req.body.trip_name,
      seating_capacity: req.body.seating_capacity,
      bus_license_number: req.body.bus_license_number,
      origin: req.body.origin,
      destination: req.body.destination,
      trip_date: req.body.trip_date,
      time: req.body.time,
      fare: req.body.fare,
      arrival_date: req.body.arrival_date,
      status: 'active'
    }));
    dbTrip.push(...tripData);
    return Helper.success(res, CREATED_CODE, ...tripData, 'Trip Created Successfully');
  }

  static cancelTrip(req, res) {
    const queryParams = parseInt(req.params.trip_id, 10);
    const cancelQuest = dbTrip.find(query => parseInt(query.trip_id, 10) === queryParams);

    if (cancelQuest) {
      if (cancelQuest.status === 'cancelled') {
        return Helper.error(res, BAD_REQUEST_CODE, 'Trip Already Cancelled');
      }

      cancelQuest.status = 'cancelled';
      return Helper.success(res, SUCCESS_CODE, cancelQuest, 'Trip cancelled successfully');
    }
    return Helper.error(res, NOT_FOUND_CODE, ID_NOT_FOUND);
  }

  static getAllTrips(req, res) {
    const isCurrentAdmin = Helper.currentUserStatus();
    if (dbTrip.length < 1) { return Helper.error(res, NOT_FOUND_CODE, NO_TRIP_AVAILABLE); }
    const availableTrips = !isCurrentAdmin ? dbTrip.filter(trip => trip.status === 'active') : dbTrip;


    const { origin, destination } = req.query;

    if (req.query.origin && req.query.destination) {
      const result = availableTrips.filter(trip => trip.origin.toLowerCase()
      === origin.toLowerCase() && trip.destination.toLowerCase() === destination.toLowerCase());

      if (result.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Origin and Destination Are Not Found'); }
      return Helper.success(res, SUCCESS_CODE, result, `${result.length} result(s) Found`);
    }

    if (destination) {
      const place = availableTrips.filter(trip => trip.destination.toLowerCase()
      === destination.toLowerCase());
      if (place.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Destination Not Found'); }
      return Helper.success(res, SUCCESS_CODE, place, `Find ${place.length} result(s) by destination ${destination}`);
    }

    if (origin) {
      const origins = availableTrips.filter(trip => trip.origin.toLowerCase()
      === origin.toLowerCase());
      if (origins.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Origin Not Found'); }
      return Helper.success(res, SUCCESS_CODE, origins, `Find ${origins.length} result(s) by origin : ${origin}`);
    }

    return Helper.success(res, SUCCESS_CODE, availableTrips, 'Success ! WayFarer Trips !');
  }

  static viewSpecificTrip(req, res) {
    const isAdmin = Helper.currentUserStatus();
    const disponible = !isAdmin ? dbTrip.filter(trip => trip.status === 'active') : dbTrip;
    const questTrip = disponible.find(quest => quest.trip_id === parseInt(req.params.trip_id, 10));
    if (questTrip) {
      return Helper.success(res, SUCCESS_CODE, questTrip, 'We Have Found The Searched Trip');
    }
    return Helper.error(res, NOT_FOUND_CODE, 'The Specified Trip was Not Found');
  }
}
