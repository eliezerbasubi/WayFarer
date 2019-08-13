import {
  CREATED_CODE
} from '../constants/responseCodes';
import Helper from '../helpers/helper';
import TripQueries from '../models/trip';

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
}
