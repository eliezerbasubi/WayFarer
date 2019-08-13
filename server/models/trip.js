import { creator, pool } from './index';
import { RESOURCE_CONFLICT, NOT_FOUND_CODE, BAD_REQUEST_CODE } from '../constants/responseCodes';
import { BUS_ALREADY_TAKEN, ID_NOT_FOUND, NO_TRIP_AVAILABLE } from '../constants/feedback';

export default class TripQueries {
  static async create(data) {
    try {
      const def = await creator.tripTable();
      if (def.error) {
        return { error: { status: 500, message: def.res } };
      }

      const exist = await pool.query('SELECT * FROM trips WHERE bus_license_number = $1 AND trip_date = $2', [data[2], data[5]]);
      if (exist.rowCount > 0) {
        return { error: { status: RESOURCE_CONFLICT, message: BUS_ALREADY_TAKEN } };
      }
      const result = await pool.query(`INSERT INTO trips (trip_name, seating_capacity, 
        bus_license_number, origin,destination, trip_date,arrival_date,time,fare ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, data);

      return result;
    } catch (e) {
      return { error: { status: 500, message: 'Unknown error' } };
    }
  }

  static async findOne(tripId) {
    const trip = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    let isStatusCancel = '';
    trip.rows.forEach((item) => {
      isStatusCancel = item.status;
    });

    if (isStatusCancel === 'cancelled') {
      return { error: { status: BAD_REQUEST_CODE, message: BUS_ALREADY_TAKEN } };
    }
    const output = await pool.query('UPDATE trips SET status = $1 WHERE id = $2 RETURNING *', ['cancelled', tripId]);
    return output;
  }

  static async findAll() {
    const tripData = await pool.query('SELECT * FROM trips ORDER BY id ASC');
    if (tripData.rowCount < 1) {
      return { error: { status: NOT_FOUND_CODE, message: NO_TRIP_AVAILABLE } };
    }
    return tripData;
  }
}
