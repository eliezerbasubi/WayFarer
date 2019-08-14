import {
  CREATED_CODE, NOT_FOUND_CODE, SUCCESS_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import TripQueries, { dbTrip } from '../models/trip';
import { ID_NOT_FOUND, NO_TRIP_AVAILABLE } from '../constants/feedback';

export default class TripController {
  static async createTrip(req, res) {
    try {
      const data = [
        req.body.trip_name,
        req.body.seating_capacity,
        req.body.bus_license_number,
        req.body.origin,
        req.body.destination,
        req.body.trip_date,
        req.body.arrival_date,
        req.body.time,
        parseFloat(req.body.fare)
      ];
      const result = await TripQueries.create(data);
      if (result.error) {
        res.status(result.error.status).json({
          status: result.error.status,
          error: result.error.message
        });
        return;
      }
      dbTrip.push(...result.rows);
      Helper.success(res, CREATED_CODE, req.body, 'Account Successfully Created');
    } catch (error) {
      Helper.error(res, 409, 'Cannot insert data in db');
    }
  }

  static async cancelTrip(req, res) {
    const queryParams = parseInt(req.params.trip_id, 10);
    const result = await TripQueries.findOne(queryParams);
    if (result.error) {
      return res.status(result.error.status).json({
        status: result.error.status,
        error: result.error.message
      });
    }
    if (result.rowCount > 0) {
      return Helper.success(res, SUCCESS_CODE, result.rows, 'Trip cancelled successfully');
    }
    return Helper.error(res, NOT_FOUND_CODE, ID_NOT_FOUND);
  }

  static async getAllTrips(req, res) {
    const { rows } = await TripQueries.findAll();
    const isAdmin = Helper.currentUserStatus();
    const activeTrips = !isAdmin ? rows.filter(trip => trip.status === 'active') : rows;
    if (activeTrips.length < 1) {
      return Helper.error(res, NOT_FOUND_CODE, NO_TRIP_AVAILABLE);
    }
    const { origin, destination } = req.query;

    if (req.query.origin && req.query.destination) {
      const result = activeTrips.filter(trip => trip.origin.toLowerCase()
      === origin.toLowerCase() && trip.destination.toLowerCase() === destination.toLowerCase());

      if (result.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Origin and Destination Are Not Found'); }
      return Helper.success(res, SUCCESS_CODE, result, `${result.length} result(s) Found`);
    }

    if (destination) {
      const place = activeTrips.filter(trip => trip.destination.toLowerCase()
      === destination.toLowerCase());
      if (place.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Destination Not Found'); }
      return Helper.success(res, SUCCESS_CODE, place, `Find ${place.length} result(s) by destination ${destination}`);
    }

    if (origin) {
      const origins = activeTrips.filter(trip => trip.origin.toLowerCase()
      === origin.toLowerCase());
      if (origins.length < 1) { return Helper.error(res, NOT_FOUND_CODE, 'Origin Not Found'); }
      return Helper.success(res, SUCCESS_CODE, origins, `Find ${origins.length} result(s) by origin : ${origin}`);
    }
    return Helper.success(res, SUCCESS_CODE, activeTrips, 'Success ! WayFarer Trips !');
  }

  static async viewSpecificTrip(req, res) {
    const isAdmin = Helper.currentUserStatus();
    const { rows } = await TripQueries.findAll();
    const disponible = !isAdmin ? rows.filter(trip => trip.status === 'active') : rows;
    const questTrip = disponible.find(quest => quest.id === parseInt(req.params.trip_id, 10));
    if (questTrip) {
      return Helper.success(res, SUCCESS_CODE, questTrip, 'We Have Found The Searched Trip');
    }

    return Helper.error(res, NOT_FOUND_CODE, 'The Specified Trip was Not Found');
  }
}
