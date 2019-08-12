import { creator, pool } from './index';
import { RESOURCE_CONFLICT } from '../constants/responseCodes';
import { EMAIL_ALREADY_EXIST } from '../constants/feedback';

export const currentUser = [];
export default class UserQuery {
  static async insert(values) {
    try {
      const def = await creator.usersTable();
      if (def.error) {
        return { error: { status: 500, message: def.res } };
      }

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
    try {
      const result = pool.query('SELECT * FROM users WHERE email=$1', values);
      return result;
    } catch (error) {
      return { error: { status: 500, message: 'Unable to select user table' } };
    }
  }

  static async findOne(id) {
    try {
      return pool.query('SELECT * FROM users WHERE id=$1', [id]);
    } catch (error) {
      return { error: { status: 500, message: 'Unable to find one user' } };
    }
  }

  static async update(values) {
    try {
      return pool.query('UPDATE users SET password = $1 WHERE id=$2', values);
    } catch (error) {
      return { error: { status: 500, message: 'Unable to update user table' } };
    }
  }
}
