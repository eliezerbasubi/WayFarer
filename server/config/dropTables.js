import { pool } from '../models';

const dropTables = async () => {
  const out = await pool.query('DROP TABLE IF EXISTS users, trips, bookings CASCADE');
  return out;
};

export default dropTables();
