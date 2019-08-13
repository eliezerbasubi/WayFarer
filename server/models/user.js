import { pool, creator } from './index';
import { RESOURCE_CONFLICT } from '../constants/responseCodes';
import { EMAIL_ALREADY_EXIST } from '../constants/feedback';

export const currentUser = [];

export default class UserQuery {
  static async insert(values) {
    try {
      await creator.createTable('CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, firstname VARCHAR(250) NOT NULL, lastname VARCHAR(250), email VARCHAR(250) NOT NULL UNIQUE,password VARCHAR(250) NOT NULL, phone VARCHAR(15) NOT NULL, country VARCHAR(50), city VARCHAR(50) NOT NULL, isAdmin BOOLEAN DEFAULT false);');

      const exist = await pool.query('SELECT * FROM users WHERE email = $1', [values[2]]);
      if (exist.rowCount > 0) {
        return { error: { status: RESOURCE_CONFLICT, message: EMAIL_ALREADY_EXIST } };
      }

      const result = await pool.query(`INSERT INTO users (firstname, lastname, email,password,phone,country,city
          ) VALUES($1, $2, $3, $4, $5,$6,$7) RETURNING id, email,isadmin`, values);

      return result;
    } catch (e) {
      return { error: { status: 500, message: e, err: e } };
    }
  }

  static async read(values) {
    return pool.query('SELECT * FROM users WHERE email=$1', values);
  }

  static async findOne(id) {
    return pool.query('SELECT * FROM users WHERE id=$1', [id]);
  }

  static async update(values) {
    return pool.query('UPDATE users SET password = $1 WHERE id=$2', values);
  }
}
