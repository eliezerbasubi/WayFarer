import { Pool } from 'pg';
import DB_URL from '../config/config';

const pool = new Pool({ connectionString: DB_URL });

const usersQuery = 'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstname VARCHAR(250) NOT NULL, lastname VARCHAR(250), email VARCHAR(250) NOT NULL UNIQUE,password VARCHAR(250) NOT NULL, phone VARCHAR(15) NOT NULL, country VARCHAR(50), city VARCHAR(50) NOT NULL, isAdmin BOOLEAN DEFAULT false);';

const tripQuery = `CREATE TABLE IF NOT EXISTS trips(
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

const bookingQuery = `CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL,
    trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE RESTRICT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    seat_number INTEGER NOT NULL,
    created_on timestamp without time zone DEFAULT NOW(),
    PRIMARY KEY(trip_id, user_id)
);`;

const dropIntest = {
  dropUserTable: async (sql) => {
    try {
      const res = await pool.query(sql);
      return res;
    } catch (e) {
      return {
        error: true,
        res: 'Unable to drop table'
      };
    }
  },

  truncateTable: async (sql) => {
    try {
      return pool.query(sql);
    } catch (error) {
      throw error;
    }
  }
};


const creator = {
  createTable: async (query) => {
    try {
      return pool.query(query);
    } catch (e) {
      return {
        error: true,
        res: 'Unable To Create Table'
      };
    }
  }
};

const runner = async () => {
  await creator.createTable(usersQuery);
  await creator.createTable(tripQuery);
  await creator.createTable(bookingQuery);
};


export { pool, runner, dropIntest };
