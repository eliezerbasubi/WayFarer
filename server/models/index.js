import { Pool } from 'pg';
import DB_URL from '../config/config';

const pool = new Pool({ connectionString: DB_URL });

const dropIntest = {
  dropUserTable: async () => {
    try {
      const res = await pool.query('DROP TABLE IF EXISTS users');
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
  }
};


export { pool, creator, dropIntest };
