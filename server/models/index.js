import { Pool } from 'pg';
import DB_URL from '../config/config';

const pool = new Pool({ connectionString: DB_URL });

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
  }
};


const creator = {
  createTable: async (query) => {
    try {
      const res = await pool.query(query);
      return res;
    } catch (e) {
      return {
        error: true,
        res: 'Unable To Create Table'
      };
    }
  }
};


export { pool, creator, dropIntest };
