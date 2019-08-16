import dotenv from 'dotenv';
import { pool } from '../models';

dotenv.config();

const data = JSON.parse(process.env.admin);

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

  await pool.query(`INSERT INTO users (firstname, lastname, email,password,phone,country,city, isadmin) 
  VALUES('${data.firstname}', '${data.lastname}', '${data.email}', '${data.password}',
    '${data.phone}','${data.country}','${data.city}', '${data.isadmin}') on conflict (email) do nothing returning *`);
  await pool.end();
  return result;
};
export default createTables();
