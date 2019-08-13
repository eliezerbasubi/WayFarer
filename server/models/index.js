import { Pool } from 'pg';
import DB_URL from '../config/config';

const pool = new Pool({ connectionString: DB_URL });

const dropIntest = {
  dropUserTable: async (sql) => {
    const res = await pool.query(sql);
    return res;
  },

  truncateTable: async sql => pool.query(sql)
};


const creator = {
  createTable: async query => pool.query(query)
};

export { pool, creator, dropIntest };
