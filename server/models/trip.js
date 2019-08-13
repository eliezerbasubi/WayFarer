import { creator, pool } from './index';
import { RESOURCE_CONFLICT } from '../constants/responseCodes';
import { BUS_ALREADY_TAKEN } from '../constants/feedback';

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
}
