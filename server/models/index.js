import { Pool } from 'pg';
import DB_URL from '../config/config';

const pool = new Pool({ connectionString: DB_URL });

const dropIntest = {
  dropTable: async (sql) => {
    try {
      const res = await pool.query(sql);
      return res;
    } catch (e) {
      return { error: true, res: 'Unable to drop table' };
    }
  },

  truncateUserTable: async () => {
    try {
      const result = pool.query('TRUNCATE TABLE users');
      return result;
    } catch (error) {
      throw error;
    }
  }
};


const creator = {
  usersTable: async () => {
    const query = 'CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstname VARCHAR(250) NOT NULL, lastname VARCHAR(250), email VARCHAR(250) NOT NULL UNIQUE,password VARCHAR(250) NOT NULL, phone VARCHAR(15) NOT NULL, country VARCHAR(50), city VARCHAR(50) NOT NULL, isAdmin BOOLEAN DEFAULT false);';

    try {
      const res = await pool.query(query);
      return res;
    } catch (e) {
      return { error: true, res: 'Users table not created' };
    }
  },

  tripTable: async () => {
    const query = `CREATE TABLE IF NOT EXISTS trips(
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
    try {
      const result = await pool.query(query);
      return result;
    } catch (error) {
      throw error;
    }
  }
};


export { pool, creator, dropIntest };
