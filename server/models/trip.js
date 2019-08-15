import { creator, pool } from './index';
import { RESOURCE_CONFLICT, BAD_REQUEST_CODE, NOT_FOUND_CODE } from '../constants/responseCodes';
import { BUS_ALREADY_TAKEN, NO_TRIP_AVAILABLE, ID_NOT_FOUND } from '../constants/feedback';

export const dbTrip = [];
export default class TripQueries {
  static async create(data) {
    const sql = `CREATE TABLE IF NOT EXISTS trips(
        id SERIAL PRIMARY KEY, 
        trip_name VARCHAR(128), 
        seating_capacity INTEGER NOT NULL,
        bus_license_number VARCHAR(50),
        origin character varying NOT NULL,
        destination character varying NOT NULL,
        trip_date timestamp without time zone DEFAULT NOW(),
        arrival_date timestamp without time zone DEFAULT NOW(),
        time TIME,
        fare double precision,
        status character varying DEFAULT 'active');`;

    await creator.createTable(sql);
    const exist = await pool.query('SELECT * FROM trips WHERE bus_license_number = $1 AND trip_date = $2', [data[2], data[5]]);
    if (exist.rowCount > 0) {
      return { error: { status: RESOURCE_CONFLICT, message: BUS_ALREADY_TAKEN } };
    }
    const result = await pool.query(`INSERT INTO trips (trip_name, seating_capacity, 
        bus_license_number, origin,destination, trip_date,arrival_date,time,fare ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`, data);

    return result;
  }

  static async findOne(tripId) {
    const trip = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
    let isStatusCancel = '';
    trip.rows.forEach((item) => {
      isStatusCancel = item.status;
    });

    if (isStatusCancel === 'cancelled') {
      return { error: { status: BAD_REQUEST_CODE, message: 'Trip Already Cancelled' } };
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

  static async getOneById(id) {
    const trip = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
    if (trip.rowCount < 1) {
      return { error: { status: NOT_FOUND_CODE, message: ID_NOT_FOUND } };
    }
    return trip;
  }

  static async getAsSpecified(data) {
    const output = await pool.query('SELECT * FROM trips WHERE id = $1 AND status = $2', data);
    return output;
  }
}
