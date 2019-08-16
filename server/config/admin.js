import dotenv from 'dotenv';
import { pool } from '../models';

dotenv.config();

const data = JSON.parse(process.env.admin);
const superAdmin = async () => {
  const res = await pool.query(`INSERT INTO users (firstname, lastname, email,password,phone,country,city, isadmin) 
  VALUES('${data.firstname}', '${data.lastname}', '${data.email}', '${data.password}',
    '${data.phone}','${data.country}','${data.city}', '${data.isadmin}') on conflict (email) do nothing returning *`);
  console.log('super admin creating...');
  await pool.end();
  return res;
};

superAdmin();
