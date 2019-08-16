import { pool } from '../models';

const createTables = async () => {
  const result = await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY, 
        firstname VARCHAR(250) NOT NULL, 
        lastname VARCHAR(250), 
        email VARCHAR(250) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL, 
        phone VARCHAR(15) NOT NULL, 
        country VARCHAR(50), 
        city VARCHAR(50) NOT NULL, 
        isAdmin boolean DEFAULT false);

        CREATE TABLE IF NOT EXISTS trips(
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
            status character varying DEFAULT 'active');

        CREATE TABLE IF NOT EXISTS bookings(
            id SERIAL PRIMARY KEY,
            trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE RESTRICT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
            seat_number INTEGER NOT NULL,
            created_on timestamp without time zone DEFAULT NOW());
        `);
  return result;
};
export default createTables();
