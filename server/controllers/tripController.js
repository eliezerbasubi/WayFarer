import {
  CREATED_CODE, NOT_FOUND_CODE, SUCCESS_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import TripQueries from '../models/trip';
import { ID_NOT_FOUND } from '../constants/feedback';

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
}
